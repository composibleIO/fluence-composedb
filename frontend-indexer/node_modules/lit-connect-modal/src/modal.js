import MicroModal from "micromodal";
import css from "./modal.css";
import rawListOfWalletsArray from "./helpers/walletList.js";
import providerMethods from "./helpers/providerMethods.js";

export default class LitConnectModal {
  constructor({ providerOptions }) {
    this.dialog = MicroModal;
    this.closeAction = undefined;
    this.parent = document.body;
    this.filteredListOfWalletsArray = [];
    this.providerOptions = providerOptions;
    this._filterListOfWallets();
    this._instantiateLitConnectModal();

    // inject css
    var style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  getWalletProvider() {
    const currentProvider = localStorage.getItem("lit-web3-provider");

    this.dialog.show("lit-connect-modal");
    return new Promise((resolve, reject) => {
      // if there is a current provider, resolve with it
      if (!!currentProvider) {
        const foundProvider = this.filteredListOfWalletsArray.find(
          (w) => w.id === currentProvider
        );
        resolve(foundProvider.provider);
        this._destroy();
        return;
      }

      // otherwise, show the list of providers
      this.filteredListOfWalletsArray.forEach((w) => {
        let walletEntry = document.getElementById(w.id);
        walletEntry.addEventListener("click", () => {
          localStorage.setItem("lit-web3-provider", w.id);
          resolve(w.provider);
          this._destroy();
          return;
        });
      });

      this.closeAction.addEventListener("click", () => {
        resolve(false);
        this._destroy();
        return;
      });
    });
  }

  _filterListOfWallets() {
    const filteredListOfWalletsArray = [];

    rawListOfWalletsArray.forEach((w) => {
      // filters list based on availability of wallets in rawListOfWalletsArray
      // availability can be confirmed by information contained here, or passed in
      if (!!w["checkIfPresent"] && w["checkIfPresent"]() === true) {
        // checks for availability based on 'checkIfPresent' function in rawListOfWalletsArray
        filteredListOfWalletsArray.push(w);
      } else if (!!this.providerOptions[w.id]) {
        // checks for availability based on imported 'providerOptions' configuration
        // the function to set the provider should always take the 'providerOptions' array and the id of the wallet
        const cloneWalletInfo = w;
        cloneWalletInfo["provider"] = providerMethods[w.id](
          this.providerOptions,
          w.id
        );
        filteredListOfWalletsArray.push(cloneWalletInfo);
      }
    });

    this.filteredListOfWalletsArray = filteredListOfWalletsArray;
  }

  _instantiateLitConnectModal() {
    const connectModal = document.createElement("div");
    connectModal.setAttribute("id", "lit-connect-modal-container");
    connectModal.innerHTML = `
      <div class="modal micromodal-slide" id="lit-connect-modal" aria-hidden="true">
        <div class="lcm-modal-overlay" id="lcm-modal-overlay" tabindex="-1" data-micromodal-close>
          <div class="lcm-modal-container" role="dialog" aria-modal="true" aria-labelledby="lit-connect-modal-title">
            <main class="lcm-modal-content" id="lit-connect-modal-content">
            </main>
          </div>
        </div>
      </div>
    `;

    this.parent.appendChild(connectModal);
    this.trueButton = document.getElementById("lcm-continue-button");
    this.closeAction = document.getElementById("lcm-modal-overlay");

    this._buildListOfWallets();

    this.dialog.init({
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false,
      debugMode: false,
    });
    const testEntry = document.getElementById("lcm-metaMast");
  }

  _buildListOfWallets() {
    const contentContainer = document.getElementById(
      "lit-connect-modal-content"
    );
    let walletListHtml = ``;
    this.filteredListOfWalletsArray.forEach((w) => {
      walletListHtml += `
        <div class="lcm-wallet-container" id="${w.id}">
          <img class="lcm-wallet-logo"  src=${w.logo} />
          <div class="lcm-text-column">
            <p class="lcm-wallet-name" >${w.name}</p>
            <p class="lcm-wallet-synopsis" >${w.synopsis}</p>
          </div>
        </div>
      `;
    });
    contentContainer.innerHTML = walletListHtml;
  }

  _destroy() {
    const dialog = document.getElementById("lit-connect-modal-container");
    if (!!dialog) {
      dialog.remove();
    }
  }
}
