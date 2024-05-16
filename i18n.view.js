export default {
  tag: "app-i18n",
  secondary: true,
  props: {
    language: {
      defaultValue: "en",
      scope: "app"
    },
    dropdown: {
      defaultValue: false
    },
    i18n: {
      title: "Change Language"
    }
  },
  firstUpdated: () => {},
  render: function () {
    const {
      html,
      language,
      setLanguage,
      dropdown,
      setDropdown,
      i18n: t
    } = this;
    const languages = {
      en: "English",
      es: "Español",
      pt: "Português"
    };

    const handleLanguageChange = (code) => (
      setLanguage(code), setDropdown(false)
    );

    return html` <div
      id="language-dropdown"
      title=${t("title")}
      class="dropdown"
    >
      <div tabindex="0" class="btn btn-ghost normal-case">
        <button
          class=${language === "en" ? "active" : ""}
          @click=${() => setDropdown(true)}
        >
          <span
            class="badge badge-sm badge-outline font-mono !text-[.6rem] pt-px opacity-50 font-bold tracking-widest !pr-1 !pl-1.5"
          >
            ${language.toUpperCase()}
          </span>
          ${languages[language]}
        </button>
      </div>
      <div
        class="dropdown-content bg-base-200 text-base-content rounded-box top-px mt-12 -ml-6 w-40 overflow-y-auto shadow ${dropdown
    ? "dropdown-open"
    : "hidden"}"
      >
        <ul class="menu menu-sm gap-1" tabindex="0">
          ${Object.entries(languages).map(
    ([code, name]) => html` <li>
              <button
                class=${language === code ? "active" : ""}
                @click=${() => handleLanguageChange(code)}
              >
                <span
                  class="badge badge-sm badge-outline font-mono !text-[.6rem] pt-px opacity-50 font-bold tracking-widest !pr-1 !pl-1.5"
                >
                  ${code.toUpperCase()}
                </span>
                ${name}
              </button>
            </li>`
  )}
        </ul>
      </div>
    </div>`;
  }
};
