# VehicAid Infrastructure Guide

## 🚀 Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, GKE, EKS, or AKS)
- kubectl installed and configured
- Docker images built and pushed to registry

### Quick Start

```powershell
# Deploy everything
.\infrastructure\deploy-k8s.ps1
```

### Manual Deployment

```bash
# Create namespaces
kubectl create namespace vehicaid
kubectl create namespace monitoring

# Apply secrets
kubectl apply -f infrastructure/k8s/secrets.yaml -n vehicaid

# Deploy database
kubectl apply -f infrastructure/k8s/database-deployment.yaml -n vehicaid

# Deploy backend
kubectl apply -f infrastructure/k8s/backend-deployment.yaml -n vehicaid

# Deploy web apps
kubectl apply -f infrastructure/k8s/web-deployments.yaml -n vehicaid

# Deploy monitoring
kubectl apply -f infrastructure/k8s/monitoring.yaml -n monitoring
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n vehicaid
kubectl get pods -n monitoring

# Check services
kubectl get svc -n vehicaid
kubectl get svc -n monitoring

# Check logs
kubectl logs -f deployment/vehicaid-backend -n vehicaid
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Add Secrets to GitHub Repository**:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `KUBE_CONFIG`: Base64 encoded kubeconfig file
     - `GITHUB_TOKEN`: Automatically provided

2. **Trigger Pipeline**:
   - Push to `main` branch triggers full deployment
   - Push to `develop` branch triggers tests only
   - Pull requests trigger tests

### Pipeline Stages

1. **Backend Test**: Runs Django tests with PostgreSQL and Redis
2. **Backend Build**: Builds and pushes Docker image
3. **Web Build**: Builds all three web applications
4. **Deploy**: Deploys to Kubernetes cluster
5. **Notify**: Sends deployment notification

### Manual Trigger

```bash
# Trigger workflow manually
gh workflow run ci-cd.yml
```

---

## 📊 Production Monitoring

### Prometheus

**Access**: http://<prometheus-ip>:9090

**Metrics Available**:
- HTTP request rate
- Response times
- Error rates
- Database queries
- Cache hit rates
- CPU/Memory usage

**Useful Queries**:
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Response time (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Database connections
pg_stat_database_numbackends
```

### Grafana

**Access**: http://<grafana-ip>:3000  
**Default Credentials**: admin / admin (change immediately)

**Pre-configured Dashboards**:
1. **Application Overview**
   - Request rate
   - Error rate
   - Response times
   - Active users

2. **Database Metrics**
   - Connection pool
   - Query performance
   - Cache hit ratio

3. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

### Setting Up Dashboards

1. Add Prometheus as data source:
   - URL: http://prometheus:9090
   - Access: Server (default)

2. Import dashboards:
   - Go to Dashboards > Import
   - Use dashboard IDs:
     - 3662: Prometheus 2.0 Overview
     - 9628: PostgreSQL Database
     - 1860: Node Exporter Full

3. Create custom dashboards for VehicAid metrics

---

## 🔐 Security Best Practices

### Secrets Management

```bash
# Create secrets from file
kubectl create secret generic vehicaid-secrets \
  --from-file=database-url=./secrets/db-url.txt \
  --from-file=redis-url=./secrets/redis-url.txt \
  -n vehicaid

# Update secret
kubectl delete secret vehicaid-secrets -n vehicaid
kubectl create secret generic vehicaid-secrets --from-literal=key=value -n vehicaid
```

### Network Policies

```yaml
# Restrict backend access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: vehicaid-backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: vehicaid-web-admin
    - podSelector:
        matchLabels:
          app: vehicaid-web-provider
    - podSelector:
        matchLabels:
          app: vehicaid-web-booker
```

---

## 📈 Scaling

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vehicaid-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vehicaid-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment vehicaid-backend --replicas=5 -n vehicaid

# Scale web apps
kubectl scale deployment vehicaid-web-admin --replicas=3 -n vehicaid
```

---

## 🔍 Troubleshooting

### Common Issues

**Pods not starting**:
```bash
kubectl describe pod <pod-name> -n vehicaid
kubectl logs <pod-name> -n vehicaid
```

**Database connection issues**:
```bash
# Check database pod
kubectl exec -it postgres-0 -n vehicaid -- psql -U vehic_aid

# Check connection from backend
kubectl exec -it deployment/vehicaid-backend -n vehicaid -- python manage.py dbshell
```

**Service not accessible**:
```bash
# Check service endpoints
kubectl get endpoints -n vehicaid

# Port forward for testing
kubectl port-forward svc/vehicaid-backend-service 8000:8000 -n vehicaid
```

### Health Checks

```bash
# Backend health
curl http://<backend-ip>:8000/api/v1/health/

# Database health
kubectl exec -it postgres-0 -n vehicaid -- pg_isready
```

---

## 🔄 Updates & Rollbacks

### Rolling Update

```bash
# Update backend image
kubectl set image deployment/vehicaid-backend backend=vehicaid/backend:v2.0 -n vehicaid

# Check rollout status
kubectl rollout status deployment/vehicaid-backend -n vehicaid
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/vehicaid-backend -n vehicaid

# Rollback to specific revision
kubectl rollout undo deployment/vehicaid-backend --to-revision=2 -n vehicaid

# Check rollout history
kubectl rollout history deployment/vehicaid-backend -n vehicaid
```

---

## 📊 Monitoring Alerts

### Prometheus Alerting Rules

```yaml
groups:
- name: vehicaid_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    annotations:
      summary: "High error rate detected"
  
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    annotations:
      summary: "High response time detected"
  
  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    annotations:
      summary: "Database is down"
```

---

## 🎯 Production Checklist

- [ ] All secrets configured
- [ ] Database backups enabled
- [ ] Monitoring dashboards set up
- [ ] Alerts configured
- [ ] SSL/TLS certificates installed
- [ ] Resource limits configured
- [ ] Autoscaling enabled
- [ ] Network policies applied
- [ ] Logging aggregation set up
- [ ] Disaster recovery plan documented

---

## 📞 Support

For infrastructure issues:
- Check logs: `kubectl logs -f deployment/<name> -n vehicaid`
- Check events: `kubectl get events -n vehicaid`
- Contact DevOps team: devops@vehicaid.com
