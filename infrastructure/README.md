# Infrastructure

Contains infrastructure-as-code, deployment configurations, and shared resources.

## Structure

- `docker/` - Docker configurations and compose files
- `kubernetes/` - Kubernetes deployment manifests
- `terraform/` - Infrastructure provisioning scripts
- `monitoring/` - Monitoring and observability configurations
- `scripts/` - Deployment and utility scripts

## Deployment

The project supports multiple deployment strategies:

- Local development with Docker Compose
- Kubernetes for production environments
- Cloud-native deployments (AWS, GCP, Azure)

## Monitoring

- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for logging
- Jaeger for distributed tracing
