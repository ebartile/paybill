{{/*
Expand the name of the chart.
*/}}
{{- define "paybill.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "paybill.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "paybill.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "paybill.labels" -}}
helm.sh/chart: {{ include "paybill.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "paybill.selectorLabels" -}}
app.kubernetes.io/name: {{ include "paybill.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create a default fully qualified postgresql name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "paybill.postgresql.fullname" -}}
{{- if .Values.postgresql.fullnameOverride -}}
{{- .Values.postgresql.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default "postgresql" .Values.postgresql.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Hostname
*/}}
{{- define "paybill.postgresql.host" -}}
{{- if .Values.postgresql.enabled }}
    {{- if eq .Values.postgresql.architecture "replication" }}
        {{- printf "%s-%s" (include "paybill.postgresql.fullname" .) "primary" | trunc 63 | trimSuffix "-" -}}
    {{- else -}}
        {{- include "paybill.postgresql.fullname" . -}}
    {{- end -}}
{{- else -}}
    {{- .Values.external_postgresql.PG_HOST -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Port
*/}}
{{- define "paybill.postgresql.port" -}}
{{- if .Values.postgresql.enabled }}
    {{- $port := 5432 -}}
    {{- if .Values.postgresql.service -}}
        {{- $port = .Values.postgresql.service.port | default 5432 -}}
    {{- end -}}
    {{- printf "%d" $port -}}
{{- else -}}
    {{- .Values.external_postgresql.PG_PORT | default "5432" -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Database Name
*/}}
{{- define "paybill.postgresql.database" -}}
{{- if .Values.postgresql.enabled }}
    {{- .Values.postgresql.auth.database -}}
{{- else -}}
    {{- .Values.external_postgresql.PG_DB -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Secret Name
*/}}
{{- define "paybill.postgresql.secretName" -}}
{{- if .Values.postgresql.enabled }}
    {{- if .Values.postgresql.auth.existingSecret }}
        {{- .Values.postgresql.auth.existingSecret }}
    {{- else }}
        {{- printf "%s-postgresql" (include "paybill.fullname" .) -}}
    {{- end }}
{{- else }}
    {{- default (printf "%s-external-postgresql" (include "paybill.fullname" .)) .Values.external_postgresql.existingSecret -}}
{{- end }}
{{- end }}

{{/*
Returns the correct ingress class name based on selected controller.
*/}}
{{- define "paybill.ingressClassName" -}}
{{- if .Values.ingress.ingressClassName }}
{{ .Values.ingress.ingressClassName }}
{{- else if eq .Values.ingress.type "nginx" }}
nginx
{{- else if eq .Values.ingress.type "traefik" }}
traefik
{{- else }}
nginx
{{- end }}
{{- end }}

{{/*
Return the appropriate apiVersion for autoscaling.
*/}}
{{- define "paybill.autoscaling.apiVersion" -}}
{{- if .Capabilities.APIVersions.Has "autoscaling/v2beta1" }}
{{- print "autoscaling/v2beta1" -}}
{{- else -}}
{{- print "autoscaling/v2beta2" -}}
{{- end -}}
{{- end -}}