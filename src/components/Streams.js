import React, { useEffect, useState } from 'react';
import api from '../api';

const Streams = () => {
  const [channels, setChannels] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get('https://api.twitch.tv/helix/streams');
      let dataArray = result.data.data;

      /* retrieve game ids from data array; we aren't given game names in result,
       * so we must make another api call below with the game ids we retrieve to get the names */
      let gameIds = dataArray.map(streams => {
        return streams.game_id;
      });
      
      let baseUrl = 'https://api.twitch.tv/helix/games?';
      let queryParams = '';

      gameIds.map(id => {
        return (queryParams = queryParams + `id=${id}&`);
      });

      let finalUrl = baseUrl + queryParams;
      
      let gameNames = await api.get(finalUrl);

      let gameNameArray = gameNames.data.data;

      let finalArray = dataArray.map(stream => {
        stream.gameName = '';
        gameNameArray.map(name => {
          // Replace with a forEach to disregard the need for return?
          if (stream.game_id === name.id) {
            return stream.gameName = name.name;
          }
          return;
        });
      
        let newUrl = stream.thumbnail_url
          .replace('{width}', '300')
          .replace('{height}', 300);
        
        stream.thumbnail_url = newUrl;
        return stream;
      });

      setChannels(finalArray);
    }
    
    fetchData();
  }, []);

  console.log(channels);

  return (
    <div>
      <h1>Most Popular Live Streams</h1>
      <div className='row'>
        {channels.map(channel => (
          <div className='col-lg-3 col-md-4 col-sm-6 mt-5' key={channel.id}>
            <div className='card'>
              <img className='card-img-top' src={channel.thumbnail_url} alt={channel.user_name}/>
              <div className='card-body'>
                <h3 className='card-title'>{channel.user_name}</h3>
                <h5 className='card-text'>{channel.gameName}</h5>
                <div className='card-text'>
                  {channel.viewer_count} live viewers
                </div>
                <button className='btn btn-success'>
                  <a
                    href={`https://twitch.tv/${channel.user_name}`}
                    className='link'
                    target='_blank'
                  >
                    watch {channel.user_name}'s stream
                  </a>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Streams;