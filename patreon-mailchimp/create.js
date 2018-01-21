/**
 * Constants
 */
const mailchimpAPI = 'https://<dc>.api.mailchimp.com/3.0/lists/<list_id>/members';
const mailchimpAuth = 'Basic <base64_encoded_anystring:api_key>';
const mailchimpGroups = {
  'group1': '1234567890',
  'group2': 'abcdefghij',
  'group3': 'xxxxxxxxxx',
  'onHold': 'yyyyyyyyyy',
};
let message = '';

/**
 * Set up data
 */
const pledge = {
  email: inputData.email,
  fname: inputData.fname,
  lname: inputData.lname,
  amount: parseInt(inputData.amount, 10) / 100, // Convert from cents to $
  patron: (inputData.lname) ? `${inputData.fname} ${inputData.lname}` : inputData.fname,
};
// Debugging
console.log(pledge);

/**
 * Set up new Mailchimp subscriber
 */
let newSubscriber = {
  "email_address": pledge.email,
  "status": "subscribed",
  "merge_fields": {
    "FNAME": pledge.fname,
    "LNAME": pledge.lname,
  },
  "interests": {},
};

/**
 * Primary pledge-based group routing
 * We assume that a brand new patron wouldn't start paused or with a declined charge.
 */
if (pledge.amount >= 15) {
  message = `${pledge.patron} was added to our {ABC} MailChimp group.`;
  newSubscriber = Object.assign(newSubscriber, setGroup('group1'));
} else if (pledge.amount >= 5) {
  message = `${pledge.patron} was added to our {XYZ} MailChimp group.`;
  newSubscriber = Object.assign(newSubscriber, setGroup('group2'));
} else {
  message = `${pledge.patron} was added to our {123} MailChimp group.`;
  newSubscriber = Object.assign(newSubscriber, setGroup('group3'));
}
updateMailchimp(newSubscriber);

/**
 * Primary fetch logic for adding a new Mailchimp subscriber.
 *
 * @param {object} body - POST JSON body
 * @see https://developer.mailchimp.com/documentation/mailchimp/guides/manage-subscribers-with-the-mailchimp-api/
 */
function updateMailchimp(body) {
  const endpoint = mailchimpAPI;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': mailchimpAuth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch(endpoint, options)
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      slackAlert();
      var output = json;
      callback(null, output);
    })
    .catch(callback);

  // Debugging
  console.log(message);
}

/**
 * Helper function for moving a patron into a single
 * Mailchimp group (and removing all other groups)
 *
 * @param {string} group - any of the human-readable keys inside mailchimpGroups
 */
function setGroup(selectedGroup) {
  let groupsToSend = {};

  for (var group in mailchimpGroups) {
    const groupId = mailchimpGroups[group];
    groupsToSend[groupId] = (group === selectedGroup);
  }

  return { interests: groupsToSend };
}

/**
 * Post to Slack whenever something happens on Zapier.
 * Very rudimentary logging/debugging. If issues (timeouts, etc) happen often,
 * we'll need to implement more robust error catching, alerting, and messaging.
 */
function slackAlert() {
  const webhook = '<slack_hook_here>';

  fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({text: `New Patron! ${message}`}),
  })
    .catch(callback);
}
