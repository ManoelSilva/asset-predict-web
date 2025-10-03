[Leia em Português (pt-br)](README.pt-br.md)

# Asset Predict Web

Asset Predict Web is an Angular frontend application that provides a user interface for the Asset Predict system. It allows users to search for Brazilian stock market assets and get AI-powered price predictions.

## Features

- **Asset Search**: Search and select Brazilian stock market assets with autocomplete
- **Price Predictions**: Get AI-powered price direction predictions for selected assets
- **Real-time Data**: Connect to live data from the asset-data-lake service
- **Responsive Design**: Modern Material Design UI that works on desktop and mobile
- **Prediction History**: View previous predictions with timestamps

## Architecture

The application is built with:
- **Angular 20.3**: Modern Angular framework with standalone components
- **Angular Material**: Material Design components for consistent UI
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for data handling

## API Integration

The frontend integrates with two backend services:

### Asset Data Lake API (Port 5002)
- **Base URL**: `http://localhost:5002` (development)
- **Endpoints**:
  - `GET /assets` - Search and list available assets
  - `GET /asset/<ticker>` - Get specific asset information

### Model Prediction API (Port 5001)
- **Base URL**: `http://localhost:5001/api/b3` (development)
- **Endpoints**:
  - `POST /predict` - Get price predictions for a ticker

## Project Structure

```
src/
├── app/
│   ├── app.ts              # Main application component
│   ├── app.html            # Main template
│   ├── app.scss            # Main styles
│   ├── app.config.ts       # Application configuration
│   └── app.spec.ts         # Unit tests
├── environments/
│   ├── environment.ts      # Development environment config
│   └── environment.prod.ts # Production environment config
├── index.html              # Main HTML file
├── main.ts                 # Application bootstrap
└── styles.scss             # Global styles
```

## Environment Configuration

### Development Environment
```typescript
export const environment = {
  production: false,
  predictionUrl: 'http://localhost:5001/api/b3',
  assetsUrl: 'http://localhost:5002'
};
```

### Production Environment
Update `environment.prod.ts` with your production API URLs:
```typescript
export const environment = {
  production: true,
  predictionUrl: 'http://your-ec2-ip:5001/api/b3',
  assetsUrl: 'http://your-ec2-ip:5002'
};
```

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

### Production Build

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### AWS EC2 Deployment

The application is deployed to AWS EC2 using nginx:

1. **Build the application**
   ```bash
   ng build --configuration production
   ```

2. **Deploy using the provided script**
   ```bash
   sudo bash deploy_asset_predict_web.sh
   ```

3. **Access the application**
   - URL: `http://your-ec2-ip/`
   - Served via nginx on port 80

### Nginx Configuration

The deployment script uses a custom nginx configuration:
- **File**: `asset-predict-web-nginx.conf`
- **Location**: `/etc/nginx/conf.d/asset-predict-web.conf`
- **Features**: SPA routing, static file serving, gzip compression

## Development Workflow

### Prerequisites
- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`

### Local Development
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   ng serve
   ```

3. **Access application**
   - URL: `http://localhost:4200/`
   - Hot reload enabled for development

### Testing
```bash
# Unit tests
ng test

# End-to-end tests (if configured)
ng e2e
```

## API Configuration

### Updating API Endpoints

To change API endpoints, update the environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  predictionUrl: 'http://localhost:5001/api/b3',
  assetsUrl: 'http://localhost:5002'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  predictionUrl: 'http://your-production-api:5001/api/b3',
  assetsUrl: 'http://your-production-api:5002'
};
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend services are running
   - Verify API URLs in environment files
   - Check CORS configuration on backend

2. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Deployment Issues**
   - Ensure nginx is running: `sudo systemctl status nginx`
   - Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify file permissions: `sudo chown -R nginx:nginx /usr/share/nginx/html`

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
