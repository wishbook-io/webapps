# webapps

## Overview
Web Apps at Wishbook, including seller panel, superadmin using common components. Angular based.
- The sellerpanel and superadmin apps are located in separate subdirectories, each with their own source code and configuration files. 
- The vendors folder contains third-party vendors and self-compiled libraries that are shared across the apps. By keeping these dependencies in a separate folder, they can be easily managed and updated without affecting the individual apps. This also helps to reduce duplication and keep the apps more lightweight.

### TODOs
1. Why are there common vendor 3rd party components in vendor & appwise vendors - eg superadmin/vendor, sellerpanel/vendor - eg ./vendor/textAngular
2. Make the vendor files be auto-fetched or populated. Does this need package.json or CI? 
3. Cleanup the nested vendor folders, each with their dist & other folders. The further nest dists are currently checked in.
4. Confirm that the SaaS functinoality is part of the sellerpanel app itself, and not a separate app.
