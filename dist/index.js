var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// csv.js
var csv_exports = {};
__export(csv_exports, {
  convertToCSV: () => convertToCSV,
  exportCSV: () => exportCSV,
  getFields: () => getFields,
  parseCSV: () => parseCSV2,
  removeColumns: () => removeColumns,
  transformCsvData: () => transformCsvData
});

// file.js
var file_exports = {};
__export(file_exports, {
  exportFile: () => exportFile,
  parseCSV: () => parseCSV,
  readFile: () => readFile
});
var readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event2) => resolve(event2.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
var exportFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
var parseCSV = (csvData) => {
  const rows = csvData.split("\n");
  const headers = rows[0].split(",");
  return rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  });
};

// csv.js
var parseCSV2 = (csvData) => {
  const rows = csvData.trim().split("\n");
  const headers = rows[0].split(",");
  return rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  }).filter((row) => Object.values(row).some((value) => value));
};
var getFields = (data) => {
  return data.length > 0 ? Object.keys(data[0]) : [];
};
var removeColumns = (data, columnsToRemove) => {
  return data.map((row) => {
    columnsToRemove.forEach((column) => delete row[column]);
    return row;
  });
};
var convertToCSV = (data) => {
  if (data.length === 0)
    return "";
  const headers = Object.keys(data[0]);
  const rows = data.map(
    (obj) => headers.map((header) => JSON.stringify(obj[header] ?? "")).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};
var exportCSV = (data) => {
  const csvString = convertToCSV(data);
  exportFile(csvString, "exported-data.csv", "text/csv");
};
var transformCsvData = (csvData, fieldMapping) => {
  return csvData.map((row) => mapRowToModel(row, fieldMapping));
};
var mapRowToModel = (row, fieldMapping) => {
  return Object.keys(fieldMapping).reduce((acc, modelField) => {
    const csvField = fieldMapping[modelField];
    acc[modelField] = row[csvField];
    return acc;
  }, {});
};

// datetime.js
var formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(navigator.language);
};
var formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };
  return date.toLocaleTimeString(navigator.language, options);
};
var formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(navigator.language);
};
var timeAgo = (timestamp) => {
  const now = Date.now();
  const difference = now - timestamp;
  const minute = 60 * 1e3;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  if (difference < minute) {
    return "Just now";
  } else if (difference < hour) {
    return Math.round(difference / minute) + " minutes ago";
  } else if (difference < day) {
    return Math.round(difference / hour) + " hours ago";
  } else if (difference < week) {
    return Math.round(difference / day) + " days ago";
  } else {
    return formatDate(timestamp);
  }
};
var datetime_default = { formatDate, formatDateTime, formatTime, timeAgo };

// droparea.js
var currentDroparea;
var currentDraggedItem;
var currentPosition;
var placeholderElement;
var createPlaceholderElement = () => {
  if (!placeholderElement) {
    placeholderElement = document.createElement("div");
    placeholderElement.classList.add(
      "drag-placeholder",
      "h-24",
      "w-24",
      "bg-primary",
      "border",
      "transition-all",
      "m-auto"
    );
  }
  return placeholderElement;
};
var insertPlaceholder = (parent, position = "end", referenceNode = null) => {
  const placeholder = createPlaceholderElement();
  if (position === "start") {
    parent.insertBefore(placeholder, parent.firstChild);
  } else if (position === "before" && referenceNode) {
    parent.insertBefore(placeholder, referenceNode);
  } else {
    parent.appendChild(placeholder);
  }
};
var removeExistingPlaceholder = (parent) => {
  const existingPlaceholder = parent.querySelector(".drag-placeholder");
  existingPlaceholder?.remove();
};
var draggable = {
  dragstart: function() {
    currentDraggedItem = this.id;
    this.style.opacity = "0.1";
  },
  dragend: function() {
    this.style.opacity = "1";
    if (currentDroparea && currentDraggedItem && !isNaN(currentPosition)) {
      this.dropItem?.({
        droparea: currentDroparea,
        item: currentDraggedItem,
        position: currentPosition
      });
      currentDroparea = null;
      currentDraggedItem = null;
      currentPosition = null;
    }
    if (placeholderElement) {
      placeholderElement.remove();
    }
  },
  connectedCallback: function() {
    if (this.draggable) {
      this.addEventListener("dragstart", this.dragstart);
      this.addEventListener("dragend", this.dragend);
    }
  },
  disconnectedCallback: function() {
    if (this.draggable) {
      this.removeEventListener("dragstart", this.dragstart);
      this.removeEventListener("dragend", this.dragend);
    }
  }
};
var droparea = {
  drop: function(event2) {
    event2.preventDefault();
    const children = Array.from(event2.currentTarget.children);
    currentPosition = children.indexOf(placeholderElement);
    removeExistingPlaceholder(event2.currentTarget);
  },
  dragleave: function(event2) {
    const dropareaBounds = event2.currentTarget.getBoundingClientRect();
    removeExistingPlaceholder(event2.currentTarget);
    if (this.vertical && event2.clientY === 0 || !this.vertical && event2.clientX === 0) {
      currentDroparea = null;
      currentDraggedItem = null;
      currentPosition = null;
    } else if (this.vertical && event2.clientY < dropareaBounds.top || !this.vertical && event2.clientX < dropareaBounds.left) {
      insertPlaceholder(event2.currentTarget, "start");
      currentPosition = 0;
    }
  },
  dragover: function(event2) {
    event2.preventDefault();
    const droparea2 = event2.currentTarget;
    const items = Array.from(droparea2.children).filter(
      (child) => !child.classList.contains("drag-placeholder")
    );
    if (!items.length) {
      if (!placeholderElement) {
        insertPlaceholder(droparea2);
      }
      currentPosition = 0;
      currentDroparea = droparea2.id;
      return;
    }
    const compareVal = this.vertical ? event2.clientY : event2.clientX;
    const targetItem = items.find((item, index) => {
      if (this.vertical && item.getBoundingClientRect().top > compareVal || !this.vertical && item.getBoundingClientRect().left > compareVal) {
        currentPosition = index;
        currentDroparea = droparea2.id;
        return true;
      }
      return false;
    });
    if (!targetItem && (this.vertical && compareVal > items[items.length - 1].getBoundingClientRect().bottom || !this.vertical && compareVal > items[items.length - 1].getBoundingClientRect().right)) {
      currentPosition = items.length;
      currentDroparea = droparea2.id;
    }
    if (!placeholderElement || targetItem && placeholderElement.nextSibling !== targetItem) {
      insertPlaceholder(droparea2, "before", targetItem);
    }
  },
  connectedCallback: function() {
    if (this.droparea) {
      this.addEventListener("drop", this.drop);
      this.addEventListener("dragover", this.dragover);
      this.addEventListener("dragleave", this.dragleave);
    }
  },
  disconnectedCallback: function() {
    if (this.droparea) {
      this.removeEventListener("drop", this.drop);
      this.removeEventListener("dragover", this.dragover);
      this.removeEventListener("dragleave", this.dragleave);
    }
  }
};

// i18n.js
var i18n = (key) => key;
var i18n_default = i18n;

// rest.js
function formatEndpoint(endpoint) {
  if (!endpoint.startsWith("http")) {
    return `/api/${endpoint}`.replace("//", "/");
  }
  return endpoint;
}
async function handleResponse(response) {
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    throw new Error(message);
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}
async function get(endpoint, params) {
  if (!endpoint)
    return;
  let url = endpoint;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  const response = await fetch(formatEndpoint(url));
  return handleResponse(response);
}
async function post(endpoint, params) {
  if (!endpoint)
    return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  return handleResponse(response);
}
async function patch(endpoint, updates) {
  if (!endpoint)
    return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });
  return handleResponse(response);
}
async function remove(endpoint) {
  if (!endpoint)
    return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "DELETE"
  });
  return handleResponse(response);
}

// types.js
var T = {
  boolean: (options = {}) => ({
    type: "boolean",
    defaultValue: !!options.defaultValue || false,
    ...options
  }),
  string: (options = {}) => ({
    type: "string",
    defaultValue: options.defaultValue || "",
    enum: options.enum || [],
    ...options
  }),
  array: (options = {}) => ({
    type: "array",
    defaultValue: options.defaultValue || [],
    enum: options.enum || [],
    ...options
  }),
  number: (options = {}) => ({
    type: "number",
    defaultValue: options.defaultValue || void 0,
    ...options
  }),
  date: (options = {}) => ({
    type: "date",
    defaultValue: options.defaultValue || void 0,
    ...options
  }),
  function: (options = {}) => ({
    type: "function",
    defaultValue: options.defaultValue || void 0,
    ...options
  }),
  object: (options = {}) => ({
    type: "object",
    defaultValue: options.defaultValue || void 0,
    ...options
  }),
  one: (relationship, targetForeignKey, options = {}) => ({
    type: "one",
    relationship,
    targetForeignKey,
    ...options
  }),
  many: (relationship, targetForeignKey, options = {}) => ({
    type: "many",
    relationship,
    targetForeignKey,
    ...options
  }),
  created_by: (referenceField, options = {}) => ({
    type: "object",
    metadata: "user",
    referenceField,
    ...options
  }),
  created_at: (referenceField, options = {}) => ({
    type: "string",
    metadata: "timestamp",
    referenceField,
    ...options
  }),
  text: (options = {}) => ({
    formType: "text",
    type: T.string(options),
    ...options
  }),
  datetime: (options = {}) => ({
    formType: "datetime",
    type: T.string(options),
    ...options
  }),
  time: (options = {}) => ({
    formType: "time",
    type: T.string(options),
    ...options
  }),
  checkbox: (options = {}) => ({
    formType: "checkbox",
    type: T.boolean(options),
    ...options
  }),
  radio: (options = {}) => ({
    formType: "radio",
    type: T.boolean(options),
    ...options
  }),
  toggle: (options = {}) => ({
    formType: "toggle",
    type: T.boolean(options),
    ...options
  }),
  textarea: (options = {}) => ({
    formType: "textarea",
    type: T.string(options),
    ...options
  }),
  custom: (customFormType, options) => ({
    customFormType,
    type: T[customFormType](options),
    ...options
  })
};

// url.js
var isServer = typeof window === "undefined";
var url_default = {
  getItem: (key) => {
    if (isServer)
      return;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },
  setItem: (key, value) => {
    if (isServer)
      return;
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history?.replaceState?.(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    return { key };
  },
  removeItem: (key) => {
    if (isServer)
      return;
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.replaceState?.(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    return { key };
  }
};

// index.js
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
function event(type, ...attrs) {
  const message = { type };
  attrs.forEach((attr) => {
    Object.assign(message, attr);
  });
  navigator.serviceWorker.controller.postMessage(message);
}
export {
  csv_exports as CSV,
  file_exports as File,
  T,
  datetime_default as datetime,
  debounce,
  draggable,
  droparea,
  event,
  get,
  i18n_default as i18n,
  patch,
  post,
  remove,
  url_default as url
};
//# sourceMappingURL=index.js.map
