let currentDroparea;
let currentDraggedItem;
let currentPosition;
let placeholderElement;

const createPlaceholderElement = () => {
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

const insertPlaceholder = (parent, position = "end", referenceNode = null) => {
  const placeholder = createPlaceholderElement();
  if (position === "start") {
    parent.insertBefore(placeholder, parent.firstChild);
  } else if (position === "before" && referenceNode) {
    parent.insertBefore(placeholder, referenceNode);
  } else {
    parent.appendChild(placeholder);
  }
};
const removeExistingPlaceholder = (parent) => {
  const existingPlaceholder = parent.querySelector(".drag-placeholder");
  existingPlaceholder?.remove();
};
export const draggable = {
  dragstart: function () {
    currentDraggedItem = this.id;
    this.style.opacity = "0.1";
  },

  dragend: function () {
    this.style.opacity = "1";
    if (currentDroparea && currentDraggedItem && !isNaN(currentPosition)) {
      this.dropItem?.({
        droparea: currentDroparea,
        item: currentDraggedItem,
        position: currentPosition
      });

      // Reset state
      currentDroparea = null;
      currentDraggedItem = null;
      currentPosition = null;
    }

    if (placeholderElement) {
      placeholderElement.remove();
    }
  },

  connectedCallback: function () {
    if (this.draggable) {
      this.addEventListener("dragstart", this.dragstart);
      this.addEventListener("dragend", this.dragend);
    }
  },

  disconnectedCallback: function () {
    if (this.draggable) {
      this.removeEventListener("dragstart", this.dragstart);
      this.removeEventListener("dragend", this.dragend);
    }
  }
};
export const droparea = {
  drop: function (event) {
    event.preventDefault();
    const children = Array.from(event.currentTarget.children);
    currentPosition = children.indexOf(placeholderElement);
    removeExistingPlaceholder(event.currentTarget);
  },

  dragleave: function (event) {
    const dropareaBounds = event.currentTarget.getBoundingClientRect();
    removeExistingPlaceholder(event.currentTarget);

    if (
      (this.vertical && event.clientY === 0) ||
      (!this.vertical && event.clientX === 0)
    ) {
      currentDroparea = null;
      currentDraggedItem = null;
      currentPosition = null;
    } else if (
      (this.vertical && event.clientY < dropareaBounds.top) ||
      (!this.vertical && event.clientX < dropareaBounds.left)
    ) {
      insertPlaceholder(event.currentTarget, "start");
      currentPosition = 0;
    }
  },

  dragover: function (event) {
    event.preventDefault();
    const droparea = event.currentTarget;
    const items = Array.from(droparea.children).filter(
      (child) => !child.classList.contains("drag-placeholder")
    );

    if (!items.length) {
      if (!placeholderElement) {
        insertPlaceholder(droparea);
      }
      currentPosition = 0;
      currentDroparea = droparea.id;
      return;
    }

    const compareVal = this.vertical ? event.clientY : event.clientX;
    const targetItem = items.find((item, index) => {
      if (
        (this.vertical && item.getBoundingClientRect().top > compareVal) ||
        (!this.vertical && item.getBoundingClientRect().left > compareVal)
      ) {
        currentPosition = index;
        currentDroparea = droparea.id;
        return true;
      }
      return false;
    });

    if (
      !targetItem &&
      ((this.vertical &&
        compareVal > items[items.length - 1].getBoundingClientRect().bottom) ||
        (!this.vertical &&
          compareVal > items[items.length - 1].getBoundingClientRect().right))
    ) {
      currentPosition = items.length;
      currentDroparea = droparea.id;
    }

    if (
      !placeholderElement ||
      (targetItem && placeholderElement.nextSibling !== targetItem)
    ) {
      insertPlaceholder(droparea, "before", targetItem);
    }
  },

  connectedCallback: function () {
    if (this.droparea) {
      this.addEventListener("drop", this.drop);
      this.addEventListener("dragover", this.dragover);
      this.addEventListener("dragleave", this.dragleave);
    }
  },

  disconnectedCallback: function () {
    if (this.droparea) {
      this.removeEventListener("drop", this.drop);
      this.removeEventListener("dragover", this.dragover);
      this.removeEventListener("dragleave", this.dragleave);
    }
  }
};
