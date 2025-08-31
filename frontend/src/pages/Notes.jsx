// src/components/Notes.jsx
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from "react-helmet-async";
import { X } from 'lucide-react';

const notesList = [
  {
    name: "MS-Word",
    type: "paid",
    link: "#",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxsaW5lYXJHcmFkaWVudCBpZD0iUTdYYW1EZjFobmh+Ynp+dkFPN0M2YV9wR0hjamUyOTh4U2xfZ3IxIiB4MT0iMjgiIHgyPSIyOCIgeTE9IjE0Ljk2NiIgeTI9IjYuNDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0MmEzZjIiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0MmE0ZWIiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUTdYYW1EZjFobmh+Ynp+dkFPN0M2YV9wR0hjamUyOTh4U2xfZ3IxKSIgZD0iTTQyLDZIMTRjLTEuMTA1LDAtMiwwLjg5NS0yLDJ2Ny4wMDNoMzJWOEM0NCw2Ljg5NSw0My4xMDUsNiw0Miw2eiI+PC9wYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iUTdYYW1EZjFobmh+Ynp+dkFPN0M2Yl9wR0hjamUyOTh4U2xfZ3IyIiB4MT0iMjgiIHgyPSIyOCIgeTE9IjQyIiB5Mj0iMzMuMDU0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMTE0MDhhIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTAzZjhmIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1E3WGFtRGYxaG5ofmJ6fnZBTzdDNmJfcEdIY2plMjk4eFNsX2dyMikiIGQ9Ik0xMiwzMy4wNTRWNDBjMCwxLjEwNSwwLjg5NSwyLDIsMmgyOGMxLjEwNSwwLDItMC44OTUsMi0ydi02Ljk0NkgxMnoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlE3WGFtRGYxaG5ofmJ6fnZBTzdDNmNfcEdIY2plMjk4eFNsX2dyMyIgeDE9IjI4IiB4Mj0iMjgiIHkxPSItMTUuNDYiIHkyPSItMTUuNTIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMzA3OWQ2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjk3Y2QyIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1E3WGFtRGYxaG5ofmJ6fnZBTzdDNmNfcEdIY2plMjk4eFNsX2dyMykiIGQ9Ik0xMiwxNS4wMDNoMzJ2OS4wMDJIMTJWMTUuMDAzeiI+PC9wYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iUTdYYW1EZjFobmh+Ynp+dkFPN0M2ZF9wR0hjamUyOTh4U2xfZ3I0IiB4MT0iMTIiIHgyPSI0NCIgeTE9IjI4LjUzIiB5Mj0iMjguNTMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxZDU5YjMiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxOTViYmMiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUTdYYW1EZjFobmh+Ynp+dkFPN0M2ZF9wR0hjamUyOTh4U2xfZ3I0KSIgZD0iTTEyLDI0LjAwNWgzMnY5LjA1SDEyVjI0LjAwNXoiPjwvcGF0aD48cGF0aCBkPSJNMjIuMzE5LDEzSDEydjI0aDEwLjMxOUMyNC4zNTIsMzcsMjYsMzUuMzUyLDI2LDMzLjMxOVYxNi42ODFDMjYsMTQuNjQ4LDI0LjM1MiwxMywyMi4zMTksMTN6IiBvcGFjaXR5PSIuMDUiPjwvcGF0aD48cGF0aCBkPSJNMjIuMjEzLDM2SDEyVjEzLjMzM2gxMC4yMTNjMS43MjQsMCwzLjEyMSwxLjM5NywzLjEyMSwzLjEyMXYxNi40MjUJQzI1LjMzMywzNC42MDMsMjMuOTM2LDM2LDIyLjIxMywzNnoiIG9wYWNpdHk9Ii4wNyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMi4xMDYsMzVIMTJWMTMuNjY3aDEwLjEwNmMxLjQxNCwwLDIuNTYsMS4xNDYsMi41NiwyLjU2VjMyLjQ0QzI0LjY2NywzMy44NTQsMjMuNTIsMzUsMjIuMTA2LDM1eiIgb3BhY2l0eT0iLjA5Ij48L3BhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJRN1hhbURmMWhuaH5ien52QU83QzZlX3BHSGNqZTI5OHhTbF9ncjUiIHgxPSI0Ljc0NCIgeDI9IjIzLjQ5NCIgeTE9IjE0Ljc0NCIgeTI9IjMzLjQ5MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzI1NmFjMiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzEyNDdhZCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggZmlsbD0idXJsKCNRN1hhbURmMWhuaH5ien52QU83QzZlX3BHSGNqZTI5OHhTbF9ncjUpIiBkPSJNMjIsMzRINmMtMS4xMDUsMC0yLTAuODk1LTItMlYxNmMwLTEuMTA1LDAuODk1LTIsMi0yaDE2YzEuMTA1LDAsMiwwLjg5NSwyLDJ2MTYJQzI0LDMzLjEwNSwyMy4xMDUsMzQsMjIsMzR6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4LjQwMywxOWwtMS41NDYsNy4yNjRMMTUuMTQ0LDE5aC0yLjE4N2wtMS43NjcsNy40ODlMOS41OTcsMTlINy42NDFsMi4zNDQsMTBoMi4zNTJsMS43MTMtNy42ODkJTDE1Ljc2NCwyOWgyLjI1MWwyLjM0NC0xMEgxOC40MDN6Ij48L3BhdGg+Cjwvc3ZnPg=="
  },
  {
    name: "PowerPoint",
    type: "paid",
    link: "#",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNkYzRjMmMiIGQ9Ik04LDI0YzAsOS45NDEsOC4wNTksMTgsMTgsMThzMTgtOC4wNTksMTgtMThIMjZIOHoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZjdhMjc4IiBkPSJNMjYsNnYxOGgxOEM0NCwxNC4wNTksMzUuOTQxLDYsMjYsNnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjYzA2MzQ2IiBkPSJNMjYsNkMxNi4wNTksNiw4LDE0LjA1OSw4LDI0aDE4VjZ6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzliMzQxZiIgZD0iTTIyLjMxOSwzNEg1LjY4MUM0Ljc1MywzNCw0LDMzLjI0Nyw0LDMyLjMxOVYxNS42ODFDNCwxNC43NTMsNC43NTMsMTQsNS42ODEsMTRoMTYuNjM4IEMyMy4yNDcsMTQsMjQsMTQuNzUzLDI0LDE1LjY4MXYxNi42MzhDMjQsMzMuMjQ3LDIzLjI0NywzNCwyMi4zMTksMzR6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE0LjY3MywxOS4wMTJIMTB2MTBoMi4wMjR2LTMuNTIxSDE0LjNjMS44NzYsMCwzLjM5Ny0xLjUyMSwzLjM5Ny0zLjM5N3YtMC4wNTggQzE3LjY5NywyMC4zNjYsMTYuMzQzLDE5LjAxMiwxNC42NzMsMTkuMDEyeiBNMTUuNTcsMjIuMzU4YzAsMC44NTktMC42OTcsMS41NTYtMS41NTYsMS41NTZoLTEuOTl2LTMuMzI1aDEuOTkgYzAuODU5LDAsMS41NTYsMC42OTcsMS41NTYsMS41NTZWMjIuMzU4eiI+PC9wYXRoPgo8L3N2Zz4="
  },
  {
    name: "Excel",
    type: "paid",
    link: "#",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSI5IiB4PSIyOCIgeT0iMTUiIGZpbGw9IiMyMWEzNjYiPjwvcmVjdD48cGF0aCBmaWxsPSIjMTg1YzM3IiBkPSJNNDQsMjRIMTJ2MTZjMCwxLjEwNSwwLjg5NSwyLDIsMmgyOGMxLjEwNSwwLDItMC44OTUsMi0yVjI0eiI+PC9wYXRoPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSI5IiB4PSIyOCIgeT0iMjQiIGZpbGw9IiMxMDdjNDIiPjwvcmVjdD48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgeD0iMTIiIHk9IjE1IiBmaWxsPSIjM2ZhMDcxIj48L3JlY3Q+PHBhdGggZmlsbD0iIzMzYzQ4MSIgZD0iTTQyLDZIMjh2OWgxNlY4QzQ0LDYuODk1LDQzLjEwNSw2LDQyLDZ6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzIxYTM2NiIgZD0iTTE0LDZoMTR2OUgxMlY4QzEyLDYuODk1LDEyLjg5NSw2LDE0LDZ6Ij48L3BhdGg+PHBhdGggZD0iTTIyLjMxOSwxM0gxMnYyNGgxMC4zMTlDMjQuMzUyLDM3LDI2LDM1LjM1MiwyNiwzMy4zMTlWMTYuNjgxQzI2LDE0LjY0OCwyNC4zNTIsMTMsMjIuMzE5LDEzeiIgb3BhY2l0eT0iLjA1Ij48L3BhdGg+PHBhdGggZD0iTTIyLjIxMywzNkgxMlYxMy4zMzNoMTAuMjEzYzEuNzI0LDAsMy4xMjEsMS4zOTcsMy4xMjEsMy4xMjF2MTYuNDI1CUMyNS4zMzMsMzQuNjAzLDIzLjkzNiwzNiwyMi4yMTMsMzZ6IiBvcGFjaXR5PSIuMDciPjwvcGF0aD48cGF0aCBkPSJNMjIuMTA2LDM1SDEyVjEzLjY2N2gxMC4xMDZjMS40MTQsMCwyLjU2LDEuMTQ2LDIuNTYsMi41NlYzMi40NEMyNC42NjcsMzMuODU0LDIzLjUyLDM1LDIyLjEwNiwzNXoiIG9wYWNpdHk9Ii4wOSI+PC9wYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iZmxFSm53ZzdxfnVLVWRrWDBLQ3lCYV9VRUNtQlNnQk92UFRfZ3IxIiB4MT0iNC43MjUiIHgyPSIyMy4wNTUiIHkxPSIxNC43MjUiIHkyPSIzMy4wNTUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxODg4NGYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYjY3MzEiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjZmxFSm53ZzdxfnVLVWRrWDBLQ3lCYV9VRUNtQlNnQk92UFRfZ3IxKSIgZD0iTTIyLDM0SDZjLTEuMTA1LDAtMi0wLjg5NS0yLTJWMTZjMC0xLjEwNSwwLjg5NS0yLDItMmgxNmMxLjEwNSwwLDIsMC44OTUsMiwydjE2CUMyNCwzMy4xMDUsMjMuMTA1LDM0LDIyLDM0eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05LjgwNywxOWgyLjM4NmwxLjkzNiwzLjc1NEwxNi4xNzUsMTloMi4yMjlsLTMuMDcxLDVsMy4xNDEsNWgtMi4zNTFsLTIuMTEtMy45M0wxMS45MTIsMjlIOS41MjYJbDMuMTkzLTUuMDE4TDkuODA3LDE5eiI+PC9wYXRoPgo8L3N2Zz4="
  },
  {
    name: "Python",
    type: "paid",
    link: "https://github.com/msk-python/basic/",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiMwMjc3QkQiIGQ9Ik0yNC4wNDcsNWMtMS41NTUsMC4wMDUtMi42MzMsMC4xNDItMy45MzYsMC4zNjdjLTMuODQ4LDAuNjctNC41NDksMi4wNzctNC41NDksNC42N1YxNGg5djJIMTUuMjJoLTQuMzVjLTIuNjM2LDAtNC45NDMsMS4yNDItNS42NzQsNC4yMTljLTAuODI2LDMuNDE3LTAuODYzLDUuNTU3LDAsOS4xMjVDNS44NTEsMzIuMDA1LDcuMjk0LDM0LDkuOTMxLDM0aDMuNjMydi01LjEwNGMwLTIuOTY2LDIuNjg2LTUuODk2LDUuNzY0LTUuODk2aDcuMjM2YzIuNTIzLDAsNS0xLjg2Miw1LTQuMzc3di04LjU4NmMwLTIuNDM5LTEuNzU5LTQuMjYzLTQuMjE4LTQuNjcyQzI3LjQwNiw1LjM1OSwyNS41ODksNC45OTQsMjQuMDQ3LDV6IE0xOS4wNjMsOWMwLjgyMSwwLDEuNSwwLjY3NywxLjUsMS41MDJjMCwwLjgzMy0wLjY3OSwxLjQ5OC0xLjUsMS40OThjLTAuODM3LDAtMS41LTAuNjY0LTEuNS0xLjQ5OEMxNy41NjMsOS42OCwxOC4yMjYsOSwxOS4wNjMsOXoiPjwvcGF0aD48cGF0aCBmaWxsPSIjRkZDMTA3IiBkPSJNMjMuMDc4LDQzYzEuNTU1LTAuMDA1LDIuNjMzLTAuMTQyLDMuOTM2LTAuMzY3YzMuODQ4LTAuNjcsNC41NDktMi4wNzcsNC41NDktNC42N1YzNGgtOXYtMmg5LjM0M2g0LjM1YzIuNjM2LDAsNC45NDMtMS4yNDIsNS42NzQtNC4yMTljMC44MjYtMy40MTcsMC44NjMtNS41NTcsMC05LjEyNUM0MS4yNzQsMTUuOTk1LDM5LjgzMSwxNCwzNy4xOTQsMTRoLTMuNjMydjUuMTA0YzAsMi45NjYtMi42ODYsNS44OTYtNS43NjQsNS44OTZoLTcuMjM2Yy0yLjUyMywwLTUsMS44NjItNSw0LjM3N3Y4LjU4NmMwLDIuNDM5LDEuNzU5LDQuMjYzLDQuMjE4LDQuNjcyQzE5LjcxOSw0Mi42NDEsMjEuNTM2LDQzLjAwNiwyMy4wNzgsNDN6IE0yOC4wNjMsMzljLTAuODIxLDAtMS41LTAuNjc3LTEuNS0xLjUwMmMwLTAuODMzLDAuNjc5LTEuNDk4LDEuNS0xLjQ5OGMwLjgzNywwLDEuNSwwLjY2NCwxLjUsMS40OThDMjkuNTYzLDM4LjMyLDI4Ljg5OSwzOSwyOC4wNjMsMzl6Ij48L3BhdGg+Cjwvc3ZnPg=="
  },
  {
    name: "HTML",
    type: "free",
    link: "https://msk-html.github.io/basic/",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNFNjUxMDAiIGQ9Ik00MSw1SDdsMywzNGwxNCw0bDE0LTRMNDEsNUw0MSw1eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRjZEMDAiIGQ9Ik0yNCA4TDI0IDM5LjkgMzUuMiAzNi43IDM3LjcgOHoiPjwvcGF0aD48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjQsMjV2LTRoOC42bC0wLjcsMTEuNUwyNCwzNS4xdi00LjJsNC4xLTEuNGwwLjMtNC41SDI0eiBNMzIuOSwxN2wwLjMtNEgyNHY0SDMyLjl6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTI0LDMwLjl2NC4ybC03LjktMi42TDE1LjcsMjdoNGwwLjIsMi41TDI0LDMwLjl6IE0xOS4xLDE3SDI0di00aC05LjFsMC43LDEySDI0di00aC00LjZMMTkuMSwxN3oiPjwvcGF0aD4KPC9zdmc+"
  },
  {
    name: "CSS",
    link: "https://github.com/msk-css/basic/",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiMwMjc3QkQiIGQ9Ik00MSw1SDdsMywzNGwxNCw0bDE0LTRMNDEsNUw0MSw1eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMzlCRTUiIGQ9Ik0yNCA4TDI0IDM5LjkgMzUuMiAzNi43IDM3LjcgOHoiPjwvcGF0aD48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMzMuMSAxM0wyNCAxMyAyNCAxNyAyOC45IDE3IDI4LjYgMjEgMjQgMjEgMjQgMjUgMjguNCAyNSAyOC4xIDI5LjUgMjQgMzAuOSAyNCAzNS4xIDMxLjkgMzIuNSAzMi42IDIxIDMyLjYgMjF6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTI0LDEzdjRoLTguOWwtMC4zLTRIMjR6IE0xOS40LDIxbDAuMiw0SDI0di00SDE5LjR6IE0xOS44LDI3aC00bDAuMyw1LjVsNy45LDIuNnYtNC4ybC00LjEtMS40TDE5LjgsMjd6Ij48L3BhdGg+Cjwvc3ZnPg=="
  },
  {
    name: "Bootstrap",
    link: "https://github.com/msk-bootstrap/basic",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyklEQVR4nO2Z20tUQRzHjy/10EPv9X8k/QGBtTOLXbaoh956qewlotiZRaxEC3opE7q5Elh2AS9QYRIJRZBmF6JaUiKiiC6kEpvYrn5iXOwIuXXm7DmeivOF39P+9sz3M/ObOTNzHCdWrFixYoUrqtKCPUqQU5KClhBmqFIbL5SkzrRdsX0taA3btC4fLRWZzwhWR2geE5kk1b4BlKA5agAtafINoAXtkQMI2isBuBA1gJJ0+AeQXI0aQAsu+wZQgh4vjTRshMat5eNgqqIR6PIPIBnw0sjdLv6or2Mw3A/HdlhD3PYNoCWvgwKY09QknDlgVUKvfJnfn2K5EkzbAtzrhax242IT9J+H8U9uzvhHqK/1WEKCaePFGkBJarz20nyA3taFc5q3Q37CzTtrMwoJ1tkDCLJBAph4esfN62y2mMiCrJX5dIKVWvAtaIDRR27eid0WAJK88eTJfF0NS7Wg32al8AKQzUCxWMoZfWxRPvLnKNw03soa37uGZVqyQUke2D58PsCTAehuKUXPSbjVAblBmJkp/f72ZWk+2LahTQiG0gnWG6+/1nySlK+HWiyjpudtSkeXj82hAZiV5st7N8Y+QGHK/d2MxOAN78uo9gowW0KCWiUZrASg3Bw4l4Y3OTfP/EfbzgPjTVC7YAnNqT7FEi3pCxrAROM2KHwv5RULcHiLFUCf8eZpJapPssIsXUEDmHg3av8yU5K88eTYSEvawgCY+OzmntrnuffbnKi3EiY6j7h5ppQOeSyhtGBtZJu5jka4dhpyQ+67wOj+dY+9Lyj62syFtZ02GnkIDZtC3k4HfaCZzMPIMFw6OntVskgHGkF3EEdKz70tgz9SXvHb8F9xqNf/+rWKsjjUhAYgLA8z/9XVYiZJddQA6QSrnEpkrrgjAxAcdyoXVUqwS0meL9oHDsGzjGBnIB84YsWKFSuW8xv9ABXlvamd/sh5AAAAAElFTkSuQmCC"
  },
  {
    name: "JavaScript",
    link: "https://github.com/msk-javascript/basic",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNmZmQ2MDAiIGQ9Ik02LDQyVjZoMzZ2MzZINnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDAwMDAxIiBkPSJNMjkuNTM4IDMyLjk0N2MuNjkyIDEuMTI0IDEuNDQ0IDIuMjAxIDMuMDM3IDIuMjAxIDEuMzM4IDAgMi4wNC0uNjY1IDIuMDQtMS41ODUgMC0xLjEwMS0uNzI2LTEuNDkyLTIuMTk4LTIuMTMzbC0uODA3LS4zNDRjLTIuMzI5LS45ODgtMy44NzgtMi4yMjYtMy44NzgtNC44NDEgMC0yLjQxIDEuODQ1LTQuMjQ0IDQuNzI4LTQuMjQ0IDIuMDUzIDAgMy41MjguNzExIDQuNTkyIDIuNTczbC0yLjUxNCAxLjYwN2MtLjU1My0uOTg4LTEuMTUxLTEuMzc3LTIuMDc4LTEuMzc3LS45NDYgMC0xLjU0NS41OTctMS41NDUgMS4zNzcgMCAuOTY0LjYgMS4zNTQgMS45ODUgMS45NTFsLjgwNy4zNDRDMzYuNDUyIDI5LjY0NSAzOCAzMC44MzkgMzggMzMuNTIzIDM4IDM2LjQxNSAzNS43MTYgMzggMzIuNjUgMzhjLTIuOTk5IDAtNC43MDItMS41MDUtNS42NS0zLjM2OEwyOS41MzggMzIuOTQ3ek0xNy45NTIgMzMuMDI5Yy41MDYuOTA2IDEuMjc1IDEuNjAzIDIuMzgxIDEuNjAzIDEuMDU4IDAgMS42NjctLjQxOCAxLjY2Ny0yLjA0M1YyMmgzLjMzM3YxMS4xMDFjMCAzLjM2Ny0xLjk1MyA0Ljg5OS00LjgwNSA0Ljg5OS0yLjU3NyAwLTQuNDM3LTEuNzQ2LTUuMTk1LTMuMzY4TDE3Ljk1MiAzMy4wMjl6Ij48L3BhdGg+Cjwvc3ZnPg=="
  },
  {
    name: "MarkDown",
    type: "free",
    link: "https://github.com/msk-markdown",
    icon: "https://img.icons8.com/officel/80/markdown.png",
  },
  {
    name: "Linux",
    type: "free",
    link: "https://github.com/msk-linux/commands/blob/main/commands.md",
    icon: "data:image/png;base64,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"
  },
];


const Notes = () => {
  const { theme } = useContext(ThemeContext); // 'light' or 'dark'
  const isDark = theme === 'dark';

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Filtering logic
  const filteredNotes = notesList.filter(note => {
    const matchesSearch = note.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ? true : note.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>Study Notes | MSK Institute</title>
        <meta
          name="description"
          content="Download and access study notes for MS-Word, PowerPoint, Excel, HTML, CSS, Bootstrap, JavaScript, and Python. Learn coding and computer skills with MSK Institute."
        />
        <meta
          name="keywords"
          content="study notes, coding notes, MSK Institute, HTML notes, CSS notes, JavaScript notes, Python notes, Excel, Word, PowerPoint, Bootstrap"
        />
        <meta name="author" content="MSK Institute" />
        <link rel="canonical" href="https://msk.shikohabad.in/notes" />

        {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
        <meta property="og:title" content="Study Notes | MSK Institute" />
        <meta
          property="og:description"
          content="Access free study notes for MS-Word, PowerPoint, Excel, HTML, CSS, Bootstrap, JavaScript, and Python at MSK Institute."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msk.shikohabad.in/notes" />
        <meta property="og:image" content="https://msk.shikohabad.in/assets/notes-preview.png" />
        <meta property="og:site_name" content="MSK Institute" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Study Notes | MSK Institute" />
        <meta
          name="twitter:description"
          content="Explore and download notes for MS-Word, Excel, PowerPoint, HTML, CSS, JavaScript, Python, and more."
        />
        <meta name="twitter:image" content="https://msk.shikohabad.in/assets/notes-preview.png" />
        <meta name="twitter:site" content="@mskinstitute" />

        {/* Schema.org JSON-LD for rich results */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "MSK Institute",
            "url": "https://msk.shikohabad.in",
            "logo": "https://msk.shikohabad.in/assets/logo.png",
            "sameAs": [
              "https://www.facebook.com/mskinstitute",
              "https://www.linkedin.com/company/mskinstitute",
              "https://twitter.com/mskinstitute"
            ],
            "description":
              "MSK Institute offers high-quality coding and computer courses with study notes for MS-Word, PowerPoint, Excel, HTML, CSS, Bootstrap, JavaScript, and Python."
          })}
        </script>
      </Helmet>


      <section
        className={`py-16 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold sm:text-4xl ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              Study Notes
            </h2>
            <p
              className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Access notes for different subjects and programming languages.
            </p>
          </div>



          {/* Search + Filter Controls */}
          <div className="flex gap-4 mb-6">

            {/* Search Box with Clear Button */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full pr-10" // pr-10 for space for icon
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border sm:w-auto transition-colors duration-300
    ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-400 focus:ring focus:ring-blue-400/30"
                  : "bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-500/30"
                }`}
            >
              <option value="all" className={`${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>All</option>
              <option value="free" className={`${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>Free</option>
              <option value="paid" className={`${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>Paid</option>
            </select>

          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, idx) => (
                <a
                  key={idx}
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative flex flex-col items-center p-6 rounded-2xl overflow-hidden shadow-sm transition transform hover:-translate-y-1 ${isDark
                    ? "bg-gray-800 border border-gray-700 text-gray-100 hover:shadow-lg hover:border-blue-400"
                    : "bg-white border border-gray-200 text-gray-800 hover:shadow-md hover:border-blue-500"
                    }`}
                >
                  {/* Badge Ribbon */}
                  <div
                    className={`absolute top-0 right-0 w-0 h-0 border-t-[50px] border-l-[50px] ${note.type === "free"
                      ? "border-t-green-500 border-l-transparent"
                      : "border-t-amber-500 border-l-transparent"
                      }`}
                  >
                    <span
                      className="absolute top-[-35px] right-[2px] text-[10px] font-bold text-white rotate-45"
                    >
                      {note.type === "free" ? "FREE" : "PAID"}
                    </span>
                  </div>



                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center h-16 w-16 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                  >
                    <img src={note.icon} alt={note.name} className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <span
                    className={`mt-3 text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-800"
                      }`}
                  >
                    {note.name}
                  </span>
                </a>))
            ) : (
              <p className="col-span-full text-center text-gray-500">No notes found</p>
            )}
          </div>

        </div>
      </section>

    </>

  );
};

export default Notes;
