import React from 'react';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { UserSearchQuery } from '@/lib/Actions/User';

const SearchBar = ({ setResults, setonFocus, setvalue, value }: any) => {
  const [input, setInput] = useState('');
  const fetchData = (value: string) => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user: any) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };

  const handleChange = async (value: string) => {
    setInput(value);
    setvalue(value);
    const res = await UserSearchQuery(value);
    console.log(JSON.parse(res).res);
    setResults(JSON.parse(res).res);
  };
  return (
    <div className="w-full h-[40px] border-none rounded-[10px] px-[15px] shadow-sm bg-white flex items-center">
      <FaSearch className="text-[#4169e1]" />
      <input
        placeholder="Search"
        value={value}
        className="bg-transparent text-black border-none focus:outline-none h-full text-[20px] w-full ml-[5px]"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          setonFocus(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setonFocus(false);
          }, 1000);
        }}
      />
    </div>
  );
};

export default SearchBar;
