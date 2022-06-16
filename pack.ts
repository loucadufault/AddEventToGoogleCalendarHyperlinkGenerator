import * as coda from "@codahq/packs-sdk";

import { deleteUndefinedProps } from "./utils/object.helpers";
import { toCompliantFormattedString } from "./utils/date.helpers";

export const pack = coda.newPack();

pack.addFormula({
  name: "SimpleHyperlink",
  description: "Generates a hyperlink to add an event to a Google Calendar, using the basic fields and sensible defaults.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "The title of the event.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "startDate",
      description: "Start date and time of the event. If the event is all day, the time portion will be discarded.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "endDate",
      description: "Start date and time of the event. If the event is all day, the time portion will be discarded.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "timezone",
      description: "Custom time zone for the event start and end date and times, among the [list of time zones from the tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). The default is to use the user's time zone.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "isAllDay",
      description: "Whether or not the event lasts for the entire day(s).",
      suggestedValue: false,
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "description",
      description: "Description of the event. Accepts some basic HTML tags like `<b>`, `<a>`, `<br>`.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "location",
      description: "Location of the event. Make sure it's an address google maps can read easily.",
      optional: true,
      // suggestedValue: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "crm",
      description: "If Free, Busy, or Out of Office.",
      optional: true,
      autocomplete: [
        { display: "Free", value: "AVAILABLE" },
        { display: "Busy", value: "BUSY" },
        { display: "Out of Office", value: "BLOCKING" },
      ]
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "trp",
      description: "Show event as busy or available. Stands for [RFC 5545 transparency](https://tools.ietf.org/html/rfc5545#section-3.8.2.7_). It's ignored for all day events, please refer to `crm` instead.",
      optional: true,
      autocomplete: [
        { display: "Busy", value: 1 },
        { display: "Avaialble", value: 0 },
      ]
    }),
    coda.makeParameter({
      type: coda.ParameterType.SparseStringArray,
      name: "guests",
      description: "List of guest email addresses.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "src",
      description: "Add an event to a shared calendar rather than a user's default",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "recurrence",
      description: "Set the recurrence of the event following the [RFC-5545 specs](https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html). See the [RRULE tool](https://icalendar.org/rrule-tool.html) for creating RRULE compatible strings.",
      optional: true,
    }),
  ],

  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Url,

  execute: async function ([title, startDate, endDate, timezone, isAllDay, description, location, crm, trp, guests, src, recurrence], context) {
    if (isAllDay) {
      endDate.setDate(endDate.getDate() + 1)
    }
    const dates =`${toCompliantFormattedString(startDate)}/${toCompliantFormattedString(endDate)}`;
  
    const BASIC_URL = "https://calendar.google.com/calendar/render";
    const params = deleteUndefinedProps({
      action: "TEMPLATE",
      text: title,
      details: description,
      timezone: timezone, // we shouldn't have to do this, but also we don't validate user input at all so...
      location: location,
      crm,
      trp: !!trp,
      add: guests !== undefined ? guests.join(",") : undefined,
      src: src,
      recur: recurrence,
    });
    let url = coda.withQueryParams(BASIC_URL, params);
    url += `?${dates}`; // don't encode (the '/' character)
    const spropParams = "&sprop=website:www.coda.io&sprop=name:Coda";
    url += spropParams;
    return url;
  }
});
