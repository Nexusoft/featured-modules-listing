export default function (request, context) {
  const walletVersion = getQueryValue(request.url, 'wallet_version');
  const parsedVersion = parseVersion(walletVersion);

  if (parsedVersion) {
    const matchedList = list.find((fm) =>
      isHigherOrEqual(parsedVersion, fm.fromWalletVersion)
    );
    if (matchedList) {
      return sendResponse(matchedList.modules, context);
    }
  }

  // if (!parsedVersion || !matchedList)
  return sendResponse(list.find((fm) => fm.latest).modules, context);
}

function getQueryValue(url, key) {
  const index = url.indexOf('?');
  const queryString = index >= 0 ? url.substring(index + 1) : '';
  const queries = queryString.split('&');
  const matchedQuery = queries.find((query) => query.startsWith(key + '='));
  if (!matchedQuery) return '';
  const value = matchedQuery.substring(key.length + 1);
  return value;
}

function parseVersion(version) {
  const versionRegex = /^(\d+)\.(\d+)\.(\d+)/;
  const result = versionRegex.exec(version);
  if (!result) return null;
  const major = parseInt(result[1]);
  const minor = parseInt(result[2]);
  const patch = parseInt(result[3]);
  return { major, minor, patch };
}

function isHigherOrEqual(ver1, ver2) {
  if (ver1.major < ver2.major) return false;
  else if (ver1.major > ver2.major) return true;
  else if (ver1.minor < ver2.minor) return false;
  else if (ver1.minor > ver2.minor) return true;
  else if (ver1.patch < ver2.patch) return false;
  else return true;
}

const maxAge = 604800; // 7 days

function sendResponse(data, context) {
  const res = context.json(data);
  res.headers.append('Access-Control-Allow-Origin', '*');
  res.headers.append('Cache-Control', 'max-age=' + maxAge);
  return res;
}

const list = [
  {
    latest: true,
    fromWalletVersion: {
      major: 3,
      minor: 1,
      patch: 0,
    },
    modules: [
      {
        name: 'nexus_invoice',
        displayName: 'Nexus Invoice',
        description: 'Send, pay, and manage invoices on Nexus blockchain',
        type: 'app',
        icon: 'https://nexus-static-resources.netlify.app/invoice.svg',
        repoInfo: {
          host: 'github.com',
          owner: 'Nexusoft',
          repo: 'nexus-invoice-module',
        },
        author: {
          name: 'Nexus Team',
          email: 'developer@nexus.io',
        },
      },
      {
        name: 'nexus_market_data',
        displayName: 'Market Data',
        description: 'Market Data of Nexus trading on major exchanges',
        type: 'app',
        icon: 'https://nexus-static-resources.netlify.app/chart.svg',
        repoInfo: {
          host: 'github.com',
          owner: 'Nexusoft',
          repo: 'nexus-market-data-module',
        },
        author: {
          name: 'Nexus Team',
          email: 'developer@nexus.io',
        },
      },
      {
        name: 'transaction_history',
        displayName: 'Transaction History Module',
        description: 'Loads and Saves history data for your Nexus Account',
        type: 'app',
        icon: 'https://nexus-static-resources.netlify.app/tx_history.svg',
        repoInfo: {
          host: 'github.com',
          owner: 'Nexusoft',
          repo: 'nexus-transaction-history-module',
        },
        author: {
          name: 'Nexus Team',
          email: 'developer@nexus.io',
        },
      },
    ],
  },
];
