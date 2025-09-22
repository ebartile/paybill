#!/bin/bash
set -e

echo "
 _____            _     _ _ _ 
|  __ \          | |   (_) | |
| |__) |_ _ _   _| |__  _| | |
|  ___/ _  | | | |  _ \| | | |
| |  | (_| | |_| | |_) | | | |
|_|   \____|\___ |____/|_|_|_|
             __/ |            
            |___/       

Open Source Apps To Grow Your Business.!
GitHub: https://github.com/paybilldev/paybill
"

pnpm db:setup:prod
pnpm start:prod