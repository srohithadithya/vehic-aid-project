# VehicAid Kubernetes Deployment Script

Write-Host "🚀 VehicAid Kubernetes Deployment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if kubectl is installed
if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl is not installed. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Create namespace
Write-Host "`n📦 Creating namespace..." -ForegroundColor Yellow
kubectl create namespace vehicaid --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets
Write-Host "`n🔐 Applying secrets..." -ForegroundColor Yellow
kubectl apply -f infrastructure/k8s/secrets.yaml -n vehicaid

# Deploy database
Write-Host "`n💾 Deploying database..." -ForegroundColor Yellow
kubectl apply -f infrastructure/k8s/database-deployment.yaml -n vehicaid

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Gray
kubectl wait --for=condition=ready pod -l app=postgres -n vehicaid --timeout=300s

# Deploy backend
Write-Host "`n🔧 Deploying backend..." -ForegroundColor Yellow
kubectl apply -f infrastructure/k8s/backend-deployment.yaml -n vehicaid

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Gray
kubectl wait --for=condition=ready pod -l app=vehicaid-backend -n vehicaid --timeout=300s

# Deploy web applications
Write-Host "`n🎨 Deploying web applications..." -ForegroundColor Yellow
kubectl apply -f infrastructure/k8s/web-deployments.yaml -n vehicaid

# Deploy monitoring
Write-Host "`n📊 Deploying monitoring stack..." -ForegroundColor Yellow
kubectl apply -f infrastructure/k8s/monitoring.yaml -n monitoring

# Get service URLs
Write-Host "`n🌐 Service URLs:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

$services = @(
    @{Name = "Backend API"; Namespace = "vehicaid"; Service = "vehicaid-backend-service" },
    @{Name = "Admin Panel"; Namespace = "vehicaid"; Service = "vehicaid-web-admin" },
    @{Name = "Provider App"; Namespace = "vehicaid"; Service = "vehicaid-web-provider" },
    @{Name = "Booker App"; Namespace = "vehicaid"; Service = "vehicaid-web-booker" },
    @{Name = "Prometheus"; Namespace = "monitoring"; Service = "prometheus" },
    @{Name = "Grafana"; Namespace = "monitoring"; Service = "grafana" }
)

foreach ($svc in $services) {
    $ip = kubectl get svc $svc.Service -n $svc.Namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ($ip) {
        Write-Host "$($svc.Name): http://$ip" -ForegroundColor Green
    }
    else {
        Write-Host "$($svc.Name): Pending..." -ForegroundColor Yellow
    }
}

# Display pod status
Write-Host "`n📋 Pod Status:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
kubectl get pods -n vehicaid
kubectl get pods -n monitoring

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`n💡 Useful commands:" -ForegroundColor Yellow
Write-Host "  kubectl get pods -n vehicaid" -ForegroundColor Gray
Write-Host "  kubectl logs -f deployment/vehicaid-backend -n vehicaid" -ForegroundColor Gray
Write-Host "  kubectl describe pod <pod-name> -n vehicaid" -ForegroundColor Gray
Write-Host "  kubectl port-forward svc/grafana 3000:3000 -n monitoring" -ForegroundColor Gray
