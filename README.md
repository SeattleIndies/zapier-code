# zapier-code
GitHub Orgs don't have gists, so I'm chucking our current Zapier code integrations into this repo for some kind of source control.

## patreon-mailchimp
We want to automatically keep our Patreon email list in sync with MailChimp for ease of sending email rewards (digital art, Steam keys, etc.). However, different reward tiers receive different email rewards - so we also need to automatically shunt each patron into a specific MailChimp group based on their pledge dollar amount.

### Our specific use-case/setup
- All patrons go into a single "Patreon" MailChimp List
- We have a set of MailChimp Groups called "Patreon Tier", which are 1:1 with our tiers (plus an additional Group called "On Hold", for patrons whose cards have been declined or who have paused their pledge
- Our MailChimp Segments also mirror our groups/tiers, and our campaigns go to each segment/group/tier.

### Technical details
- Uses Zapier's Patreon triggers (create, update, delete) and Zapier Code actions set to Javascript (FYI that Zapier's JS is locked to Node 4.3.2 currently).
- Opted to use Zapier over a Lambda/serverless endpoint because Patreon's API/webhooks doesn't appear to serve up the patron "email" field at all, which is kind of necessary for syncing with MailChimp. Also, it's a _little_ nice only having to deal with one API's auth shenanigans, and dealing with Patreon's token generation/expiration just doesn't seem worth the hassle for what you get out of it currently.

# Reuse
Feel free to re-use any of our code if we have any business logic that might help you out! I figured we can't be the only cheap cats in town needing automation on a low budget.
