# webapps

## Overview
Web Apps at Wishbook, including seller panel, superadmin using common components. Angular based.
- The sellerpanel and superadmin apps are located in separate subdirectories, each with their own source code and configuration files. 
- The vendors folder contains third-party vendors and self-compiled libraries that are shared across the apps. By keeping these dependencies in a separate folder, they can be easily managed and updated without affecting the individual apps. This also helps to reduce duplication and keep the apps more lightweight.

### To make it run
1. Modify files with hard-coded values. Some of these files:
    1. Within sellerpanel: 
        1. app/js/auth/djangoAuth.js - API_URL
        2. app/js/auth/login.js - mapStaticAPIKey
        3. app/js/app.js, app/js/deeplink/deeplink.js, app/views/partials/settings.html, app/views/deeplink/deeplink.html, wishbook_libs/js/shippingpayment/shipping_payment.js - various places with wishbook.io domain hard-coded (should have bene factored out)
        4. app/app.js - eg Google analytics code
        5. index.html - eg facebook pixel codes 
        6. wishbook-sw.js - eg firebase keys
    2. Within superadmin: should be similar as that within sellerpanel above.

### TODOs
1. Factor our domains / common settings / keys in a single file or so.
2. Why are there common vendor 3rd party components in vendor & appwise vendors - eg superadmin/vendor, sellerpanel/vendor - eg ./vendor/textAngular
3. Make the vendor files be auto-fetched or populated. Does this need package.json or CI? 
4. Cleanup the nested vendor folders, each with their dist & other folders. The further nest dists are currently checked in.
5. Confirm that the SaaS functinoality is part of the sellerpanel app itself, and not a separate app.
