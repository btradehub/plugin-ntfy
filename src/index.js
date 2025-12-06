const defaultOptions = {
  server: 'https://ntfy.sh',
  log: true,
};
const { trader, log, options, net } = api;
const { headers: defaultHeaders, server, log: enableLog } = { ...defaultOptions, ...options };

function logError(msg) {
  log('[Notify.sh⚠️] ' + msg);
}
function logSuccess(msg) {
  log('[Notify.sh✔️] ' + msg);
}

trader.addHook('setup', () => {
  if (typeof server !== 'string') {
    logError('Ntfy plugin, Missing or wrong config: server');
  }
});

api.addUtil('send', async function send(topic, msg, headers = {}) {
  if (!trader.liveMode) return;
  if (typeof msg !== 'string') {
    logError('Missing or wrong parameter: message');
    return { success: false, error: 'Missing or wrong parameter: message' };
  }
  if (typeof topic !== 'string') {
    logError('Missing or wrong parameter: topic');
    return { success: false, error: 'Missing or wrong parameter: topic' };
  }
  if (typeof headers !== 'object' || headers === null) {
    logError('Missing or wrong parameter: headers');
    return { success: false, error: 'Missing or wrong parameter: headers' };
  }
  try {
    const response = await net.post(`${server}/${topic}`, msg, {
      headers,
    });
    if (response.status === 200 && enableLog === true) {
      logSuccess(`{${topic}} ${msg.substring(0, 50)}`);
    }
    return { success: true, response };
  } catch (error) {
    if (enableLog === true) {
      logError(`{${topic}} ${error.message.substring(0, 100)}`);
    }
    return { success: false, error: error.message };
  }
}
);
