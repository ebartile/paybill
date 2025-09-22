---
id: audit-logs
title: Audit Logs
---

<div className="badge badge--primary heading-badge">   
  <img 
    src="/img/badge-icons/premium.svg" 
    alt="Icon" 
    width="16" 
    height="16" 
  />
 <span>Paid feature</span>
</div>

The audit log is the report of all the activities done in your Paybill account. It will capture and display events automatically by recording who performed an activity, what when, and where the activity was performed, along with other information such as IP address.

<!-- <div style={{textAlign: 'center'}}>

<img style={{ width:'100%', border:'0', marginBottom:'15px', borderRadius:'5px', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)' }} className="screenshot-full" src="/img/enterprise/audit_logs/logsnew-v2.png" alt="Audit logs" />

</div> -->

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

### Date Range

Retrieve the log of events that occurred within the specified date and time range using the range picker. By default, the system loads 24-hour logs for the initial view. The maximum duration that can be specified for the "from" and "to" dates is 30 days.

:::info
Pagination at the bottom allows navigation through the pages, with each page displaying a maximum of 7 logs.
:::

<!-- <div style={{textAlign: 'center'}}>

<img style={{ width:'100%', border:'0', marginBottom:'15px', borderRadius:'5px', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)' }} className="screenshot-full" src="/img/enterprise/audit_logs/filtersnew-v2.png" alt="Audit logs" />

</div> -->

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Filter Audit Logs

You can apply filters to the audited events based on the following criteria.

### Select Users

Choose a specific user from the dropdown list to view all their activities.

### Select Plugins

The dropdown will display all the plugins associated with your account. Select a plugin to filter the logs related to that particular plugin.

### Select Collections

| <div style={{ width:"100px"}}> Collection </div> | <div style={{ width:"100px"}}> Description </div> |
| ----------- | ----------- |

### Select Events

| <div style={{ width:"100px"}}> Event </div> | <div style={{ width:"100px"}}> Description </div>|
| ----------- | ----------- |

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Understanding Log Information

<!-- <div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/enterprise/audit_logs/readinglogv2.png" alt="Audit logs" />

</div> -->

| <div style={{ width:"100px"}}> Property </div> | <div style={{ width:"100px"}}> Description </div>|
| ----------- | ----------- |
| event_type | This indicates the type of event that was logged in the event. Refer to [this](#select-events) for more information on events. |
| created_at | Shows the date and time when the event was logged.  |
| id | Each logged event is assigned a unique event ID. |
| ip_address | Displays the IP address from which the event was logged. |
| metadata | The metadata includes two sub-properties: `paybill_version` and `user_agent`. `paybill_version` shows the version of Paybill used for the event, while `user_agent` contains information about the device and browser used. |
| organization_id | Every organization in Paybill has a unique ID associated with it, which is recorded when an event occurs. |
| collection_id | Different [collections](#select-collections) have their respective IDs associated with them. These IDs are assigned when the collections are created. |
| collection_name | Shows the name of the [collections](#select-collections) that were involved in the logged event. For example, if a plugin was created or deleted, it will display the name of that plugin. |
| collection_type | Indicates the type of the [collections](#select-collections) involved in the logged event. |
| user_id | Each user account in Paybill has a unique ID associated with it, which is recorded when an event occurs. |

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

### Log File

The file will contain all the data from audit logs. The log file can be created by specifying the path in the [environment variables](/docs/setup/env-vars). The log file is rotated on a daily basis and is updated dynamically every time a new audit log is generated.

Learn more about **setting up the log file generation** [here](/docs/how-to/setup-logs).

### Log Rotation

The log file is configured to rotate on a daily basis. This means that a new log file will be created every day, ensuring efficient management and organization of audit data.

### Log Redaction

Paybill implements log redaction to protect sensitive information. By default, the following headers are masked in the logs:

- authorization
- cookie
- set-cookie
- x-api-key
- proxy-authorization
- www-authenticate
- authentication-info
- x-forwarded-for

Additionally, you can specify custom fields to be masked using the `LOGGER_REDACT` environment variable.

| <div style={{ width:"100px"}}> Variable </div>| <div style={{ width:"100px"}}> Description </div>                                                                |
| -------- | --------------------------------------------------------------------------- |
| LOGGER_REDACT | Comma-separated list of additional fields to be masked in logs (e.g., req.headers["x-session-id"],req.headers["x-device-fingerprint"]) |

For example:
```bash
LOGGER_REDACT=res.headers["x-rate-limit-remaining"],res.headers["x-request-id"]
```

### Log File Path

The path for the log file is defined using the `LOGGER_BASE_PATH` variable in the environment. It's important to understand that this path is relative to the home directory of the machine. For instance, if `LOGGER_BASE_PATH` is set to `storage/logs`, the resulting log file path will be structured as follows:
```
homepath/storage/logs/main/{log_type}-{date}.log
```
Here, `{log_type}` is the type of log eg request, sql, system, system_error and `{date}` represents the current date. This structured path ensures that audit logs are organized by both log type and date, facilitating easy traceability and analysis.

| <div style={{ width:"100px"}}> Variable </div>| <div style={{ width:"100px"}}> Description </div>                                                                |
| -------- | --------------------------------------------------------------------------- |
| LOGGER_BASE_PATH | the path where the log file will be created ( eg: storage/log/main/system_2025-07-12.log) |

<details id="pb-dropdown">
<summary>Example Log file data</summary>

```bash
```

</details>

</div>
