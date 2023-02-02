const providerMethods = {
  walletconnect: (providerOptions, id) => {
    const walletConnectData = providerOptions.walletconnect;
    const opts = walletConnectData.options;

    let bridge = "https://bridge.walletconnect.org";
    let qrcode = true;
    let infuraId = "";
    let rpc = undefined;
    let chainId = 1;
    let qrcodeModalOptions = undefined;

    if (opts) {
      bridge = opts.bridge || bridge;
      qrcode = typeof opts.qrcode !== "undefined" ? opts.qrcode : qrcode;
      infuraId = opts.infuraId || "";
      rpc = opts.rpc || undefined;
      chainId = opts.chainId || 1;
      qrcodeModalOptions = opts.qrcodeModalOptions || undefined;
    }

    const WalletConnectProvider = walletConnectData.package;

    return new WalletConnectProvider({
      bridge,
      qrcode,
      infuraId,
      rpc,
      chainId,
      qrcodeModalOptions,
    });
  },
};

export default providerMethods;
