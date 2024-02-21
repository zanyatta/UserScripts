// ==UserScript==
// @name                 EscapeFromTarkov Tracker
// @name:zh-CN           逃离塔科夫：实时位置
// @namespace            https://github.com/zanyatta/UserScripts
// @version              0.1
// @description          Based on the built-in screenshot, trace yourself on the map (https://tarkov-market.com)
// @description:zh-CN    基于游戏内置截图功能，在地图（https://tarkov-market.com）中实时显示当前位置
// @author               Zanyatta
// @match                https://tarkov-market.com/maps/*
// @grant                GM_xmlhttpRequest
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @run-at               document-idle-time
// ==/UserScript==

(async function () {
  'use strict';

  // // Get the user configured request interval in seconds
  // const intervalSeconds = GM_getValue('intervalSeconds') || 3;
  // // Add configuration item: refresh interval
  // GM_registerMenuCommand('refresh interval刷新间隔', () => {
  //   const newIntervalSeconds = prompt('Refresh interval seconds (Default: 3):', intervalSeconds);
  //   GM_setValue('intervalSeconds', newIntervalSeconds || intervalSeconds);
  // });

  // Define Interface URL
  const apiUrl = GM_getValue('apiUrl') || 'http://127.0.0.1:3000/';
  // Add configuration item: api url
  GM_registerMenuCommand('apiUrl接口地址', () => {
    const newApiUrl = prompt('Service URL (Default: http://127.0.0.1:3000/):', apiUrl);
    GM_setValue('apiUrl', newApiUrl || apiUrl);
  });

  // Check if DOM loading is complete
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  do {
    await sleep(1000)
  } while (!document.querySelector('.map-layer'))

  // Open input box
  document.querySelector('.panel_top button.no-wrap').click()

  let eventSource = new EventSource('/sse');
  eventSource.addEventListener('message', (event) => {
    console.debug('--event--', event)
    // Refresh Location
    const inputElement = document.querySelector('.panel_top input');
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.value = event.data;
    inputElement.dispatchEvent(inputEvent);
  });
  eventSource.addEventListener('error', (event) => {
    // 处理连接错误，尝试重新连接
    eventSource.close();
    setTimeout(() => {
      eventSource = new EventSource(apiUrl);
    }, 1000); // 1秒后重新连接
  });

  // // Define a timer to execute requests at user set time intervals
  // setInterval(() => {
  //   GM_xmlhttpRequest({
  //     method: 'GET', url: apiUrl, onload: function (response) {
  //       const responseData = response.responseText;
  //       console.debug('responseData:', responseData);
  //
  //       // Refresh Location
  //       const inputElement = document.querySelector('.panel_top input');
  //       const inputEvent = new Event('input', { bubbles: true });
  //       inputElement.value = responseData;
  //       inputElement.dispatchEvent(inputEvent);
  //
  //     }, onerror: function (error) {
  //       console.error('error:', error);
  //     }
  //   });
  // }, intervalSeconds * 1000);

})();
