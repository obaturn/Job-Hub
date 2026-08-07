const providerConfigs = [
  { key: 'gmail', label: 'Gmail', domains: ['gmail.com'], url: 'https://mail.google.com/' },
  { key: 'outlook', label: 'Outlook', domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'], url: 'https://outlook.live.com/mail/0/' },
  { key: 'yahoo', label: 'Yahoo Mail', domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'ymail.com'], url: 'https://mail.yahoo.com/' },
  { key: 'proton', label: 'Proton Mail', domains: ['proton.me', 'protonmail.com'], url: 'https://mail.proton.me/' },
  { key: 'icloud', label: 'iCloud Mail', domains: ['icloud.com', 'me.com', 'mac.com'], url: 'https://www.icloud.com/mail/' },
]

const genericProvider = {
  key: 'generic',
  label: 'your email provider',
  domains: [],
  url: null,
}

export function getEmailProvider(email = '') {
  const domain = email.trim().toLowerCase().split('@')[1] || ''
  return providerConfigs.find((provider) => provider.domains.includes(domain)) || genericProvider
}
