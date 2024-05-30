import React, { useRef, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { ValidationError } from '../../types';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  selectError: (state: RootState) => ValidationError | null;
}

const FileInput: React.FC<Props> = ({ onChange, name, label, selectError }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const error = useAppSelector(selectError);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }

    onChange(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />

      <Grid container direction='row' spacing={2} alignItems='center'>
        <Grid item xs>
          <TextField
            fullWidth
            inputProps={{ readOnly: true }}
            label={label}
            value={fileName}
            onClick={activateInput}
            error={Boolean(getFieldError(name))}
            helperText={getFieldError(name)}
          />
        </Grid>

        <Grid item>
          <Button variant='contained' onClick={activateInput}>
            Browse
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
