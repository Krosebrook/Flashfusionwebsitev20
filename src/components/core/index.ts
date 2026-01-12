/**
 * Core FlashFusion Components - Modular Architecture
 * @version 5.1.0
 */

// Main application core
// AppCoreOptimized includes: URL-based routing, enhanced performance with React.memo/useMemo,
// improved error recovery, better memory management, progressive loading, and mobile responsiveness
export { AppCoreOptimized } from './AppCoreOptimized';

// Modular components
export { AppSystemInitializer } from './AppSystemInitializer';
export { AppRouteHandler } from './AppRouteHandler';
export { AppDebugManager } from './AppDebugManager';
export { AppPerformanceManager } from './AppPerformanceManager';

// App states
export { LoadingState } from './app-states/LoadingState';
export { ErrorState } from './app-states/ErrorState';
export { PerformanceMonitor } from './app-states/PerformanceMonitor';

// Application controller and services
export { ApplicationController } from './ApplicationController';
export { ConfigurationManager } from './ConfigurationManager';
export { FeatureManager } from './FeatureManager';
export { ServiceContainer } from './ServiceContainer';

// Main interface (lazy-loaded)
export { default as FlashFusionInterface } from './flash-fusion-interface';