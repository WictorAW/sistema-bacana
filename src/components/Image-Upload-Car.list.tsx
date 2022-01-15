import React, { useState } from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import useWindowDimensions from '../utils/getWindowDimensions';

// COMPONENTE PARA FAZER UPLOAD E MOSTRAR A IMAGEM DENTRO DO FORMULÁRIO

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props
  const srcImg = record.params['imagens_fotoDoCarro']
  const [fullScreen, setfullScreen] = useState(false)
  const { height, width } = useWindowDimensions();

  return (
    <Box onClick={ () => setfullScreen(!fullScreen)}>
      {srcImg ? fullScreen? <img src={srcImg} style={{cursor:'zoom-out',position: "absolute",
        width:width/1.4,
        background: 'white'}}/>: <img style={{cursor:'zoom-in'}} width='150px' src={srcImg} /> : 'sem imagem'}
    </Box>
  )
};

export default Edit
