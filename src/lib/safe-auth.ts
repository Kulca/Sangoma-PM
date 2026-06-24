export const getSafeAuthPack = async () => {
  const { SafeAuthPack } = await import('@safe-global/auth-kit');
  const safeAuthPack = new SafeAuthPack();
  
  const options = {
    showRPCGift: true,
    chainConfig: {
      blockExplorerUrl: 'https://amoy.polygonscan.com',
      chainId: '0x13882',
      displayName: 'Polygon Amoy Testnet',
      rpcTarget: 'https://rpc-amoy.polygon.technology',
      ticker: 'POL',
      tickerName: 'Polygon ecosystem token',
    },
  };

  await safeAuthPack.init(options as any);
  return safeAuthPack;
};
