#!/usr/bin/env bash

set -euo pipefail

: "${VAULT_TOKEN:?Set VAULT_TOKEN before running this script}"
: "${DATABASE_URL:?Set DATABASE_URL before running this script}"

VAULT_NAMESPACE="${VAULT_NAMESPACE:-vault}"
VAULT_POD="${VAULT_POD:-vault-0}"
APP_NAMESPACE="${APP_NAMESPACE:-inkwell}"
APP_SERVICE_ACCOUNT="${APP_SERVICE_ACCOUNT:-inkwell}"
DATABASE_SSL="${DATABASE_SSL:-false}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
POLICY_FILE="${PROJECT_DIR}/vault/policies/inkwell.hcl"

command -v kubectl >/dev/null || {
  echo "kubectl is required" >&2
  exit 1
}

test -f "${POLICY_FILE}" || {
  echo "Vault policy not found: ${POLICY_FILE}" >&2
  exit 1
}

kubectl get namespace "${VAULT_NAMESPACE}" >/dev/null
kubectl get namespace "${APP_NAMESPACE}" >/dev/null
kubectl get serviceaccount "${APP_SERVICE_ACCOUNT}" --namespace "${APP_NAMESPACE}" >/dev/null
kubectl wait --for=condition=ready "pod/${VAULT_POD}" --namespace "${VAULT_NAMESPACE}" --timeout=120s >/dev/null

if ! kubectl exec --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault auth list -format=json | grep -q '"kubernetes/"'; then
  kubectl exec --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
    env VAULT_TOKEN="${VAULT_TOKEN}" vault auth enable kubernetes
fi

kubectl exec --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault write auth/kubernetes/config \
  kubernetes_host=https://kubernetes.default.svc:443 >/dev/null

kubectl exec --stdin --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault policy write inkwell - \
  < "${POLICY_FILE}" >/dev/null

kubectl exec --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault write auth/kubernetes/role/inkwell \
  bound_service_account_names="${APP_SERVICE_ACCOUNT}" \
  bound_service_account_namespaces="${APP_NAMESPACE}" \
  policies=inkwell \
  audience='' \
  ttl=1h >/dev/null

printf '%s' "${DATABASE_URL}" | kubectl exec --stdin --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault kv put secret/inkwell/config \
  DATABASE_URL=- DATABASE_SSL="${DATABASE_SSL}" >/dev/null

kubectl exec --namespace "${VAULT_NAMESPACE}" "${VAULT_POD}" -- \
  env VAULT_TOKEN="${VAULT_TOKEN}" vault kv metadata get secret/inkwell/config >/dev/null

echo "Local Vault configuration is ready for the Inkwell application."
