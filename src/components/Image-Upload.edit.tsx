import React from 'react';
import { Label, Box, DropZone,DropZoneItem, DropZoneProps} from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


// COMPONENTE PARA FAZER UPLOAD E MOSTRAR A IMAGEM DENTRO DO FORMULÁRIO

const Edit: React.FC<BasePropertyProps> = (props) => {

  const { property, onChange, record } = props
  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange(property.name, files[0])
    
  }
  
  let uploadedPhoto = ""
  if(property.name === "fotoDoCarro"){
    uploadedPhoto = record.params.imagens_fotoDoCarro
  }else if(property.name === "shakensho"){
    uploadedPhoto = record.params.imagens_shakensho
  }else {
    uploadedPhoto = record.params.imagens_shupinhyo
  }
  
  const photoToUpload = record.params[property.name]
  
  return (
    <Box marginBottom='xxl'>
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange}/>
      {uploadedPhoto && !photoToUpload && (
        <DropZoneItem src={uploadedPhoto}/>
      )}
    </Box>
  )
};

export default Edit