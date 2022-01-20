import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router'
import { DrawerContent, Box, DrawerFooter, Button, Icon } from '@admin-bro/design-system'
import { ActionHeader, ActionProps, BasePropertyComponent, LayoutElementRenderer, PropertyType, RecordJSON, useRecord, useTranslation } from 'admin-bro'
import { appendForceRefresh } from '../utils/append-force-refresh'


const EditCar: FC<ActionProps> = (props) => {
  const { record: initialRecord, resource, action } = props
  const {
    record,
    handleChange,
    submit: handleSubmit,
    loading,
    setRecord,
  } = useRecord(initialRecord, resource.id)
  const { translateButton } = useTranslation()
  const history = useHistory()

  const onlyString = resource.editProperties.filter(item => item.type === "string")
  const onlyBoolean = resource.editProperties.filter(item => item.type === "boolean")


  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord)
    }
  }, [initialRecord])

  const submit = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault()
    handleSubmit().then((response) => {
      if (response.data.redirectUrl) {
        history.push(appendForceRefresh(response.data.redirectUrl))
      }
      // if record has id === has been created
      if (response.data.record.id) {
        handleChange({ params: {}, populated: {}, errors: {} } as RecordJSON)
      }
    })
    return false
  }

  return (
    <Box
      as="form"
      onSubmit={submit}
      flex
      flexGrow={1}
      flexDirection="column"
    >
      <DrawerContent>
        {action?.showInDrawer ? <ActionHeader {...props} /> : null}
        {action.layout ? action.layout.map((layoutElement, i) => (
          <LayoutElementRenderer
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            layoutElement={layoutElement}
            {...props}
            where="edit"
            onChange={handleChange}
            record={record as RecordJSON}
          />
        )) : onlyString.map(property => (
          <BasePropertyComponent
            key={property.propertyPath}
            where="edit"
            onChange={handleChange}
            property={property}
            resource={resource}
            record={record as RecordJSON}
          /> 
        ))}<Box
              flex
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-evenly">
            {onlyBoolean.map(property => (
              <Box
                minWidth="20%">
                <BasePropertyComponent
                  key={property.propertyPath}
                  where="edit"
                  onChange={handleChange}
                  property={property}
                  resource={resource}
                  record={record as RecordJSON}
                />
              </Box>
          ))}
          </Box>
      </DrawerContent>
      <DrawerFooter>
        <Button variant="primary" size="lg" type="submit" data-testid="button-save">
          {loading ? (<Icon icon="Fade" spin />) : null}
          {translateButton('save', resource.id)}
        </Button>
      </DrawerFooter>
    </Box>
  )
}

export {
  EditCar as default,
  EditCar,
}


