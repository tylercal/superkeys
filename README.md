# Superkeys
The chrome extension that lets you map keyboard shortcuts to JavaScript
actions.

## Overview
Using this extension requires at least some knowledge of JavaScript.
Typical usage would be writing a selector to find an element on the
page and calling the `#click` method on that element. For example, to
add a shortcut on the Google search results page to go to the next page
of results, you might map something like `alt+n` to

```javascript
document.getElementById('pnnext').click()
```

Shortcuts are defined in "Groups" and belong to specific sites using URL filters.
In the example above, you could use any combination of 
`https://www.google.com/search?q`,
`google.com`, or
`https://www.google.com/`. Though you'd probably just want to use the
first one so the shortcut is only active on the Google search results
page.

Shortcuts can be
* Single keys: `a`,`b`,`c`
* Keys with modifiers: `shift+alt+a`,`command+b`,`ctrl+left`
* Sequences of the above: `a b`, `g shift+home`
* Anything else you can do with [Mousetrap](https://craig.is/killing/mice)

Global shortcuts are configured by including no filter. 
You can also configure a shortcut to show the list of configured
shortcuts for the page you're on.

Configured shortcuts are synchronized between installations
via your browser account.

## Security and Permissions
This extension uses permissions that will be warned as
* **Read browsing history** to apply different shortcuts on different sites
* **Read and change data on pages** to react to keyboard shortcuts that you configure

Your browsing data isn't sent anywhere remote or used in any other way. This
extension is open source and can verify this use.