import React, { useState } from "react";
import axios from "axios";
import { AsyncPaginate } from "react-select-async-paginate";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState("Tetouan");

    const loadOptions = async (inputValue) => {
        const getData = async () => {
            const response = axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=7319155358ec2528936b7d35447a1c72`)
            return (await response).data
        }
        return getData().then((data) => {
            let newData = [];
            for (let i of data) {
                if (newData.length != 0) {
                    for (let j of newData) {
                        if (i.name != j.name && i.country != j.country) {
                            newData.push(i)
                        }
                    }
                }
                else {
                    newData.push(i)
                }
            }
            return {
                options: newData.map((city) => {
                    return {
                        value: `${city.lat} ${city.lon}`,
                        label: `${city.name}, ${city.country}`,
                    };
                }),
            };
        }).catch(error => console.log(error))
    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
};

export default Search;