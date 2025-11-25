
# Vehic-Aid API Reference — v1

A concise, well-structured reference for the Vehic-Aid REST API (v1). This document covers global settings, authentication, and grouped endpoint descriptions for Users, Services/Dispatch, Payments, and IoT.

## Table of contents

- [Global API information](#global-api-information)
- [Authentication](#authentication)
- [Users & Authentication Endpoints](#users--authentication-endpoints)
- [Services & Dispatch Endpoints](#services--dispatch-endpoints)
	- [Request initiation & status](#request-initiation--status)
	- [Lifecycle actions](#lifecycle-actions)
- [Payments](#payments)
- [IoT device ingestion](#iot-device-ingestion)
- [Notes & conventions](#notes--conventions)

---

## Global API information

| Detail | Value | Notes |
| :---- | :---- | :---- |
| Base URL | `/api/v1` | All endpoints are relative to this path. |
| Authentication | JWT Bearer Token | Required for protected endpoints. Tokens are issued via `/users/token/`.
| Timezone | Asia/Kolkata (IST) | All timestamps and scheduling follow this time zone.
| Response format | `application/json` | JSON responses by default.

---

## Authentication

- Authorization header: `Authorization: Bearer <access_token>`
- Token endpoints:
	- `POST /users/token/` — obtain access & refresh tokens using credentials.
	- `POST /users/token/refresh/` — exchange refresh token for a new access token.

Include the access token in the `Authorization` header for every request that requires authentication.

## Users & Authentication Endpoints

These endpoints manage account creation, login, and profile operations for Service Bookers and Service Providers.

| Endpoint | Method | Auth | Request (key fields) | Description |
| :--- | :---: | :---: | :--- | :--- |
| `POST /users/token/` | POST | No | `username`, `password` | Login — issues JWT `access` and `refresh` tokens.
| `POST /users/token/refresh/` | POST | No | `refresh` | Refresh access token.
| `POST /users/register/booker/` | POST | No | `email`, `password`, `phone_number` | Create a new Booker (customer) account.
| `POST /users/register/provider/` | POST | No | `email`, `password`, `bank_account_number`, `service_types` | Create a Provider account (initial status: Unverified).
| `GET /users/profile/` | GET | Yes | — | Fetch authenticated user's full profile (Booker or Provider).
| `POST /users/provider/update-location/` | POST | Yes | `latitude`, `longitude`, `is_available` | Provider-only: update live location and availability for dispatch.
| `GET /users/vehicles/` | GET | Yes | — | Booker/Provider: list registered vehicles for the user.

---

## Services & Dispatch Endpoints

Manage service requests, matching, and live status updates.

### Request initiation & status

| Endpoint | Method | Auth | Request | Description |
| :--- | :---: | :---: | :--- | :--- |
| `POST /services/request/` | POST | Yes | `vehicle_id`, `service_type`, `latitude`, `longitude` | Initiate a service request — triggers dispatch algorithm.
| `GET /services/request/{id}/status/` | GET | Yes | — | Get live request status, assigned `provider_id`, and `eta_minutes`.
| `GET /services/jobs/queue/` | GET | Yes | — | Provider-only: fetch nearby unassigned requests matching provider skills.

### Lifecycle actions

| Endpoint | Method | Auth | Request | Description |
| :--- | :---: | :---: | :--- | :--- |
| `POST /services/jobs/{id}/accept/` | POST | Yes | — | Provider accepts job; status -> `PROVIDER_EN_ROUTE`.
| `POST /services/quote/submit/` | POST | Yes | `request_id`, `total_amount`, `labor_cost`, `parts_cost` | Provider submits a dynamic pricing quote for approval.
| `POST /services/quote/{id}/approve/` | POST | Yes | — | Booker approves a submitted quote.

---

## Payments

Payment and earnings endpoints.

| Endpoint | Method | Auth | Request | Description |
| :--- | :---: | :---: | :--- | :--- |
| `POST /payments/create-order/` | POST | Yes | `amount`, `plan_id` | Create a new payment order (returns `razorpay_order_id`).
| `POST /payments/webhook/razorpay/` | POST | No | Razorpay payload | Webhook handler for `payment.captured` events. Verify signature before finalizing.
| `GET /payments/earnings/history/` | GET | Yes | — | Provider-only: fetch settlement history and pending balances.

---

## IoT device ingestion

Incoming device telemetry and panic/button presses.

| Endpoint | Method | Auth | Request | Description |
| :--- | :---: | :---: | :--- | :--- |
| `POST /iot/data-ingest/` | POST | No | `device_id`, `latitude`, `longitude`, `button_pressed` | Critical: receives payload from AWS IoT Core and triggers high-priority dispatch tasks. `button_pressed` values: `1` or `2`.
