import React, { useState, useEffect } from 'react';
import { handleSubmit } from "../functions/submit";
import { ethers } from "ethers";

const Encrypt = () => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [viewingKey, setViewingKey] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, key, value, viewingKey);
    };

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    useEffect(() => {
      const fetchAddress = async () => {
        try {
          const [address] = await provider.send("eth_requestAccounts", []);
          console.log('address1',address)
          setViewingKey(address.toLowerCase());
        } catch (error) {
          console.error("Failed to fetch address:", error);
        }
      };
  
      fetchAddress();
    }, []);

    return (
        <div className="flex flex-col full-height justify-start items-center lg:px-8 text-brand-orange">
            <div className="mt-4">
                <form onSubmit={onSubmit} className="space-y-4" style={{ width: '460px' }}>
                    <div className="border-4 border-brand-orange rounded-lg p-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 w-full">
                                Viewer Address
                            </label>
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="Enter viewer address"
                                required
                                className="mt-2 block w-full pl-2 text-brand-blue rounded-md border border-brand-orange bg-brand-tan py-1.5 shadow-sm focus:ring-2 focus:ring-brand-blue sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 w-full">
                                Secret Value
                            </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Enter secret value"
                                required
                                className="mt-2 block w-full pl-2 text-brand-blue rounded-md border border-brand-orange bg-brand-tan py-1.5 shadow-sm focus:ring-2 focus:ring-brand-blue sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white  hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Encrypt
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Encrypt;
