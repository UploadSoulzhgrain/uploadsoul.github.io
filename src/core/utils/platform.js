// src/core/utils/platform.js
/**
 * 平台适配工具
 * 用于检测当前运行环境和设备信息，以便进行平台特定的处理
 */

/**
 * 设备信息接口
 * @typedef {Object} DeviceInfo
 * @property {string} type - 设备类型
 * @property {string} os - 操作系统
 * @property {string} osVersion - 操作系统版本
 * @property {string} browser - 浏览器
 * @property {string} browserVersion - 浏览器版本
 * @property {boolean} isMobile - 是否为移动设备
 * @property {boolean} isTablet - 是否为平板设备
 * @property {boolean} isDesktop - 是否为桌面设备
 * @property {boolean} supportsVR - 是否支持VR
 * @property {number} screenWidth - 屏幕宽度
 * @property {number} screenHeight - 屏幕高度
 * @property {number} devicePixelRatio - 设备像素比
 */

/**
 * 平台特性接口
 * @typedef {Object} PlatformFeatures
 * @property {boolean} hasCamera - 是否有摄像头
 * @property {boolean} hasMicrophone - 是否有麦克风
 * @property {boolean} hasWebGL - 是否支持WebGL
 * @property {boolean} hasWebRTC - 是否支持WebRTC
 * @property {boolean} hasTouch - 是否支持触摸
 * @property {boolean} hasBluetooth - 是否支持蓝牙
 * @property {boolean} hasWebXR - 是否支持WebXR
 * @property {boolean} hasLocationAPI - 是否支持定位API
 */

/**
 * 平台适配器
 * 提供平台检测和设备信息功能
 */
export class PlatformAdapter {
  /**
   * 获取平台类型
   * @returns {string} 平台类型: 'web' | 'ios' | 'android' | 'unknown'
   */
  static getPlatformType() {
    // 检查是否在React Native环境
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // 进一步区分iOS和Android
      if (typeof navigator.userAgent === 'string') {
        if (/android/i.test(navigator.userAgent)) {
          return 'android';
        }
        if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
          return 'ios';
        }
      }
      return 'react-native';
    }
    
    // Web环境
    return 'web';
  }

  /**
   * 获取设备信息
   * @returns {DeviceInfo} 设备信息
   */
  static getDeviceInfo() {
    // 初始化设备信息对象
    const deviceInfo = {
      type: 'unknown',
      os: 'unknown',
      osVersion: '',
      browser: 'unknown',
      browserVersion: '',
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      supportsVR: false,
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    };

    // 检查是否在浏览器环境
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return deviceInfo;
    }

    // 检测移动设备
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    deviceInfo.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // 检测平板设备 (简化版)
    deviceInfo.isTablet = 
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent.toLowerCase());
    
    // 如果不是移动设备或平板，则为桌面设备
    deviceInfo.isDesktop = !deviceInfo.isMobile && !deviceInfo.isTablet;

    // 确定设备类型
    if (deviceInfo.isMobile) {
      deviceInfo.type = 'mobile';
    } else if (deviceInfo.isTablet) {
      deviceInfo.type = 'tablet';
    } else if (deviceInfo.isDesktop) {
      deviceInfo.type = 'desktop';
    }

    // 检测操作系统
    if (/windows phone/i.test(userAgent)) {
      deviceInfo.os = 'Windows Phone';
    } else if (/windows/i.test(userAgent)) {
      deviceInfo.os = 'Windows';
    } else if (/android/i.test(userAgent)) {
      deviceInfo.os = 'Android';
    } else if (/ipad|iphone|ipod/i.test(userAgent)) {
      deviceInfo.os = 'iOS';
    } else if (/mac/i.test(userAgent)) {
      deviceInfo.os = 'macOS';
    } else if (/linux/i.test(userAgent)) {
      deviceInfo.os = 'Linux';
    }

    // 尝试获取操作系统版本
    const osVersionRegex = {
      'Windows': /Windows NT (\d+\.\d+)/,
      'Android': /Android (\d+(\.\d+)?(\.\d+)?)/,
      'iOS': /OS (\d+[_\.]\d+[_\.]\d+)/,
      'macOS': /Mac OS X (\d+[_\.]\d+[_\.]\d+)/,
    };

    if (deviceInfo.os in osVersionRegex) {
      const match = userAgent.match(osVersionRegex[deviceInfo.os]);
      if (match) {
        deviceInfo.osVersion = match[1].replace(/_/g, '.');
      }
    }

    // 检测浏览器类型和版本
    if (/edge/i.test(userAgent)) {
      deviceInfo.browser = 'Edge';
      const edgeMatch = userAgent.match(/Edge\/(\d+(\.\d+)?)/);
      if (edgeMatch) deviceInfo.browserVersion = edgeMatch[1];
    } else if (/edg/i.test(userAgent)) {
      deviceInfo.browser = 'Edge';
      const edgMatch = userAgent.match(/Edg\/(\d+(\.\d+)?)/);
      if (edgMatch) deviceInfo.browserVersion = edgMatch[1];
    } else if (/firefox|fxios/i.test(userAgent)) {
      deviceInfo.browser = 'Firefox';
      const ffMatch = userAgent.match(/(?:Firefox|FxiOS)\/(\d+(\.\d+)?)/);
      if (ffMatch) deviceInfo.browserVersion = ffMatch[1];
    } else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) {
      deviceInfo.browser = 'Safari';
      const safariMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
      if (safariMatch) deviceInfo.browserVersion = safariMatch[1];
    } else if (/chrome|crios/i.test(userAgent)) {
      deviceInfo.browser = 'Chrome';
      const chromeMatch = userAgent.match(/(?:Chrome|CriOS)\/(\d+(\.\d+)?)/);
      if (chromeMatch) deviceInfo.browserVersion = chromeMatch[1];
    } else if (/opera|opr\//i.test(userAgent)) {
      deviceInfo.browser = 'Opera';
      const operaMatch = userAgent.match(/(?:Opera|OPR)\/(\d+(\.\d+)?)/);
      if (operaMatch) deviceInfo.browserVersion = operaMatch[1];
    }

    // 检测VR支持
    deviceInfo.supportsVR = typeof navigator.xr !== 'undefined' || 
                           typeof window.WebXRPolyfill !== 'undefined' ||
                           'getVRDisplays' in navigator;

    return deviceInfo;
  }

  /**
   * 获取平台特性
   * @returns {PlatformFeatures} 平台特性
   */
  static getPlatformFeatures() {
    const features = {
      hasCamera: false,
      hasMicrophone: false,
      hasWebGL: false,
      hasWebRTC: false,
      hasTouch: false,
      hasBluetooth: false,
      hasWebXR: false,
      hasLocationAPI: false,
    };

    // 检查是否在浏览器环境
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return features;
    }

    // 检测触摸支持
    features.hasTouch = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        navigator.msMaxTouchPoints > 0;

    // 检测WebGL支持
    try {
      const canvas = document.createElement('canvas');
      features.hasWebGL = !!(window.WebGLRenderingContext && 
                           (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      features.hasWebGL = false;
    }

    // 检测WebRTC支持
    features.hasWebRTC = 'RTCPeerConnection' in window || 'webkitRTCPeerConnection' in window || 'mozRTCPeerConnection' in window;

    // 检测摄像头和麦克风支持
    features.hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    features.hasMicrophone = features.hasCamera; // 通常这两个API是一起支持的

    // 检测蓝牙支持
    features.hasBluetooth = 'bluetooth' in navigator;

    // 检测WebXR支持
    features.hasWebXR = 'xr' in navigator;

    // 检测位置API支持
    features.hasLocationAPI = 'geolocation' in navigator;

    return features;
  }

  /**
   * 检查是否为移动设备
   * @returns {boolean} 是否为移动设备
   */
  static isMobileDevice() {
    return this.getDeviceInfo().isMobile;
  }

  /**
   * 检查是否为平板设备
   * @returns {boolean} 是否为平板设备
   */
  static isTabletDevice() {
    return this.getDeviceInfo().isTablet;
  }

  /**
   * 检查是否为桌面设备
   * @returns {boolean} 是否为桌面设备
   */
  static isDesktopDevice() {
    return this.getDeviceInfo().isDesktop;
  }

  /**
   * 检查是否支持VR
   * @returns {boolean} 是否支持VR
   */
  static supportsVR() {
    return this.getDeviceInfo().supportsVR;
  }

  /**
   * 检查是否支持WebRTC (用于语音聊天)
   * @returns {boolean} 是否支持WebRTC
   */
  static supportsWebRTC() {
    return this.getPlatformFeatures().hasWebRTC;
  }

  /**
   * 检查是否支持3D渲染 (WebGL)
   * @returns {boolean} 是否支持WebGL
   */
  static supports3D() {
    return this.getPlatformFeatures().hasWebGL;
  }
}

export default PlatformAdapter;