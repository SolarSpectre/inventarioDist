# Product Management System

This application provides a complete product management system with high availability and scalability features:

- **Load Balancer**: Nginx serving 3 Next.js application instances
- **Database Replication**: MySQL master-slave architecture for data redundancy
- **Database Management**: phpMyAdmin for easy database administration
- **Product Management**: Full CRUD operations with image upload
- **Search & Filtering**: Advanced search functionality
- **Authentication**: Secure user authentication via Supabase

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Load    │    │   Next.js App   │    │   Next.js App   │
│   Balancer      │───▶│   Instance 1    │    │   Instance 2    │
│   (Port 80)     │    │   (Port 3000)   │    │   (Port 3000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │   Next.js App   │
                    │   Instance 3    │
                    │   (Port 3000)   │
                    └─────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │  MySQL Master   │◄───│  MySQL Slave    │
                    │   (Port 3306)   │    │   (Port 3307)   │
                    └─────────────────┘    └─────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │   phpMyAdmin    │
                    │   (Port 8080)   │
                    └─────────────────┘
```

## Features

### High Availability & Scalability
- **Load Balancing**: Nginx distributes traffic across 3 Next.js instances
- **Database Replication**: Master-slave MySQL setup for data redundancy
- **Health Checks**: Built-in health monitoring endpoints
- **Rate Limiting**: Protection against abuse with configurable limits

### Product Management
- **Product List**: Responsive grid layout with product cards
- **Search & Filter**: Real-time search across names, descriptions, and categories
- **Image Management**: Upload to Supabase Storage or provide URLs
- **Stock Management**: Visual indicators for stock levels
- **Duplicate Prevention**: Prevents creating products with duplicate names

### Database Management
- **phpMyAdmin**: Web-based MySQL administration interface
- **Replication Monitoring**: Monitor master-slave synchronization
- **Backup Support**: Easy database backup and restore

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MySQL Configuration (for Docker)
MYSQL_HOST=mysql-master
MYSQL_USER=inventario_user
MYSQL_PASSWORD=inventario_password
MYSQL_DATABASE=inventario
MYSQL_PORT=3306
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `product-images`
3. Set bucket privacy to allow authenticated uploads
4. Copy your Supabase credentials to environment variables

### 3. Docker Setup

1. Install Docker and Docker Compose
2. Update environment variables in `docker-compose.yml`
3. Start the application:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access Points

- **Application**: http://localhost (Nginx load balancer)
- **phpMyAdmin**: http://localhost:8080
- **MySQL Master**: localhost:3306
- **MySQL Slave**: localhost:3307

## Service Details

### Load Balancer (Nginx)
- **Port**: 80
- **Algorithm**: Least Connections
- **Features**: 
  - Rate limiting
  - Gzip compression
  - Security headers
  - Health checks
  - Static file caching

### Application Instances
- **Count**: 3 Next.js instances
- **Port**: 3000 (internal)
- **Load Balancing**: Round-robin with health checks
- **Auto-restart**: On failure

### Database Architecture
- **Master**: Handles all write operations
- **Slave**: Read-only replica for redundancy
- **Replication**: Automatic master-slave synchronization
- **Backup**: Easy backup from slave instance

### phpMyAdmin
- **Port**: 8080
- **Access**: Root credentials
- **Features**: Full database administration

## Monitoring & Maintenance

### Health Checks
```bash
# Application health
curl http://localhost/health

# Individual app instances
curl http://localhost:3000/health
```

### Database Replication Status
```bash
# Check master status
docker exec inventario-mysql-master mysql -u root -prootpassword -e "SHOW MASTER STATUS\G"

# Check slave status
docker exec inventario-mysql-slave mysql -u root -prootpassword -e "SHOW SLAVE STATUS\G"
```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs nginx
docker-compose logs app-1
docker-compose logs mysql-master
```

## Scaling

### Horizontal Scaling
To add more application instances:

1. Add new app service to `docker-compose.yml`
2. Update Nginx upstream configuration
3. Restart services

### Database Scaling
- **Read Replicas**: Add more slave instances
- **Sharding**: Partition data across multiple masters
- **Connection Pooling**: Use proxy for connection management

## Security

- **Rate Limiting**: API and auth endpoint protection
- **Security Headers**: XSS, CSRF, and content type protection
- **Database Isolation**: Separate master/slave instances
- **Authentication**: Supabase-based user authentication
- **Input Validation**: Server and client-side validation

## Troubleshooting

### Common Issues

1. **Replication Not Working**:
   ```bash
   docker-compose logs mysql-replication-setup
   ```

2. **Load Balancer Issues**:
   ```bash
   docker-compose logs nginx
   ```

3. **Database Connection Errors**:
   ```bash
   docker-compose logs mysql-master
   docker-compose logs mysql-slave
   ```

### Useful Commands

```bash
# Restart specific services
docker-compose restart nginx
docker-compose restart app-1

# Scale application instances
docker-compose up -d --scale app-1=2

# Backup database
docker exec inventario-mysql-master mysqldump -u root -prootpassword inventario > backup.sql

# Restore database
docker exec -i inventario-mysql-master mysql -u root -prootpassword inventario < backup.sql
```

## Performance Optimization

- **Nginx Caching**: Static files cached for 1 year
- **Gzip Compression**: Reduces bandwidth usage
- **Connection Pooling**: Efficient database connections
- **Load Distribution**: Traffic spread across instances

## Development

The application uses:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **MySQL 8.0** with replication
- **Nginx** for load balancing
- **phpMyAdmin** for database management
- **Supabase** for authentication and file storage 