import { Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function Search() {

  const [sidebarData, setsideBarData] = useState(
    {
      SearchTerm: '',
      sort: 'desc',
      category: 'uncategorized'

    }
  );

  const [posts, setposts] = useState([])
  const [showmore, setshowmore] = useState(false);
  const [Loading, setloading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('SearchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
      setsideBarData({...sidebarData, SearchTerm: searchTermFromUrl, sort: sortFromUrl, category: categoryFromUrl})
    }

    const fetchPosts = async () => {
      setloading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);

      if(!res.ok){
        setloading(false);
        return;
      }

      if(res.ok){
        const data = await res.json();
        setposts(data.posts);
        setloading(false);

        if(data.posts.length > 9 ){
          setshowmore(true);
        }
      }
    };

    fetchPosts();

  }, [location.search]);

  // console.log(sidebarData);

  const handlechange = (e) => {
    if(e.target.value === 'SearchTerm'){
      setsideBarData({...sidebarData, SearchTerm: e.target.value});

    }

    if(e.target.value === 'sort'){
      const order = e.target.value || 'desc';
      setsideBarData({...sidebarData, sort: order});
    }

    if(e.target.id === category){
      const category = e.target.value || 'uncategorized';
      setsideBarData({...sidebarData, category });
    }
  }



  return (
    <div className='flex flex-col md:flex-row' >
      <div className='p-7 border-b md:border-r md:min-w-screen border-gray-500' >
        <form className='flex flex-col gap-8 ' >
          <div className='flex items-center gap-2 ' >
            <label className='whitespace-nowrap font-semibold' > Search Term:  </label>
            <TextInput 
            placeholder='search...' 
            id='SearchTerm' 
            type='text' 
            value={sidebarData.SearchTerm}
            onChange={handlechange}
            />
            </div>

            <div className='flex items-center gap-2' >
            <label className='whitespace-nowrap font-semibold' > sort:  </label>
            <Select onChange={handlechange} defaultValue={sidebarData.sort} id='sort' >
              <option value='desc' >latest</option>
              <option value='asc' >oldest</option>
            </Select>
            </div>

            <div className='flex items-center gap-2' >
            <label className='whitespace-nowrap font-semibold' >category:  </label>
            <Select onChange={handlechange} defaultValue={sidebarData.category} id='category' >
              <option value='uncategorized' >uncategorized</option>
              <option value='react.js' >react.js</option>
              <option value='next.js' >next.js</option>
              <option value='javascript' >javascript</option>
            </Select>
            </div>
        </form>
      </div>
    </div>
  )
}
