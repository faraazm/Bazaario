import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Text } from '@mantine/core'

const FormattedCurrencyInput = ({ setPrice, disabled }) => {
  const limit = 1000000
  const prefix = '$'

  const [errorMessage, setErrorMessage] = useState('')
  const [value, setValue] = useState()

  const handleOnValueChange = (value, values) => {
    if (!value) {
      setErrorMessage('')
      setValue('')
      setPrice('price', '')
      return
    }

    if (Number.isNaN(Number(value))) {
      setErrorMessage('Please enter a valid number')
      return
    }

    if (Number(value) > limit) {
      setErrorMessage(`Max: ${prefix}${limit}`)
      return
    } else {
        setErrorMessage('')
    }

    setValue(value)
    setPrice('price', value)
  }
  return (
    <div>
      <CurrencyInput
        className="mantine-input-copy"
        placeholder="$0.00"
        style={{ borderColor: errorMessage && '#f03e3e' }}
        value={value}
        onValueChange={handleOnValueChange}
        allowNegativeValue={false}
        prefix={prefix}
        disabled={disabled}
        step={1}
      />
      <Text size="sm" style={{ marginTop: 7.5, color: '#f03e3e' }}>
          {errorMessage}
        </Text>
    </div>
  )
}

export default FormattedCurrencyInput
