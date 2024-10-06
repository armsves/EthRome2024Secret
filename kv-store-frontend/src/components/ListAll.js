import React, { useState, useEffect } from 'react';
import { SecretNetworkClient } from "secretjs";
import { ethers } from "ethers";

const ListAll = () => {
    const [key, setKey] = useState('');
    const [viewingKey, setViewingKey] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [address, setAddress] = useState('');
    const [secretData, setSecretData] = useState('');

    useEffect(() => {
        const getAddress = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                    await provider.send("eth_requestAccounts", []); // Request access to MetaMask accounts
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    //console.log('Wallet address:', address);
                    setAddress(address.toLowerCase());
                } else {
                    console.error("MetaMask is not installed");
                }
            } catch (error) {
                console.error("Failed to get wallet address", error);
            }
        };
        getAddress();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const secretjs = new SecretNetworkClient({
                    url: "https://lcd.testnet.secretsaturn.net",
                    chainId: "pulsar-3",
                });

                const query_tx = await secretjs.query.compute.queryContract({
                    contract_address: process.env.REACT_APP_SECRET_ADDRESS,
                    code_hash: process.env.REACT_APP_CODE_HASH,
                    query: {
                        retrieve_all: {}
                    },
                });

                console.log('console.log(query_tx);', query_tx);
                setQueryResult(query_tx);
                console.log(query_tx);
            } catch (error) {
                console.error("Query failed", error);
                setQueryResult("Query failed, please try again.");
            }
        };

        fetchData();
    }, []);

    const transformQueryResult = (queryResult) => {
        if (!queryResult || !queryResult.key) {
            return [];
        }

        return queryResult.key.map(([key, time_limit, owner, viewer, active]) => ({ key, time_limit, owner, viewer, active }));
    };

    const formatSeconds = (seconds) => {
        const date = new Date(seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleString(); // Format the date and time
    };

    const transformedData = transformQueryResult(queryResult);

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const handleButtonClick = async (key) => {
        console.log('key', key);
        try {
            // Request a signature from the user's wallet
            const signer = provider.getSigner();
            const message = "Please sign this message to authenticate your query.";
            const signature = await signer.signMessage(message);

            // Get the wallet address
            const address = (await signer.getAddress()).toLowerCase();
            //setAddress(address);
            setViewingKey(address);
            //console.log('address aaaaaaaa',address)

            const secretjs = new SecretNetworkClient({
                url: "https://lcd.testnet.secretsaturn.net",
                chainId: "pulsar-3",
            });

            const query_tx = await secretjs.query.compute.queryContract({
                contract_address: process.env.REACT_APP_SECRET_ADDRESS,
                code_hash: process.env.REACT_APP_CODE_HASH,
                query: {
                    retrieve_value: {
                        key: key,
                        viewing_key: viewingKey
                    }
                },
            });
            console.log('console.log(query_tx);', query_tx);

            setSecretData(query_tx);
            console.log(query_tx);
        } catch (error) {
            console.error("Query failed", error);
            setSecretData("Query failed, please try again.");
        }
    };

    return (
        <div className="flex flex-col full-height justify-start items-center lg:px-8 text-brand-orange">
            <div className="mt-4">
                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                    <p><strong>List of secrets:</strong></p>
                    {transformedData.length > 0 ? (
                        <ul>
                            {transformedData.map(({ key, time_limit, owner, viewer, active }) => (
                                <li key={key}>
                                    <span>{key}</span>: <span>{formatSeconds(time_limit)}</span>
                                    <p>Owner: {owner}</p>
                                    <p> Viewer: {viewer}</p>
                                    {viewer.toLowerCase() === address.toLowerCase() && (
                                        <button
                                            onClick={() => handleButtonClick(key)}
                                            className="ml-2 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                                        >
                                            Reveal Secret
                                        </button>
                                    )}
                                    {owner.toLowerCase() === address.toLowerCase() && (
                                        <button
                                            onClick={() => handleButtonClick(key)}
                                            className="ml-2 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                                        >
                                            {active ? "Revoke Access" : "Grant Access"}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No secrets available</p>
                    )}
                </div>
            </div>
            {secretData && (
                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                    <p><strong>Secret:</strong></p>
                    <p>{secretData.value}</p>
                </div>
            )}

        </div>
    );
};

export default ListAll;
