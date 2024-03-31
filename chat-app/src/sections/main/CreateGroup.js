import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import RHFAutocomplete from '../../components/hook-form/RHFAutoComplete';


const MEMBERS=["Name 1","Name 2","Name 3"]

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const CreateGroupForm=({handleClose})=>{
const NewGroupSchema=Yup.object().shape({
    name:Yup.string().required("Name is required"),
    members:Yup.array().min(2,"Must have atleast 2 members")
})
const defaultValues={
    title:"",
    members:[],
}
const methods=useForm({
    resolver:yupResolver(NewGroupSchema),
    defaultValues,
})
const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Your submit logic goes here
    } catch (error) {
      console.log(error);
      reset(); // Reset form
      setError("afterSubmit", {
        ...error,
        message: error.message,
      }); // Set error
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ paddingTop: 2 }}>
            <RHFTextField name="name" label="Name" />
            <RHFAutocomplete
                name="members"
                label="Members"
                multiple
                freeSolo
                ChipProps={{ size: "medium" }}
                options={MEMBERS.map((option) => option)}
            />
            <Stack spacing={2} direction={"row"} alignItems={"center"} justifyContent={"end"}>
                <Button variant="contained" onClick={ handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained">
                    Create
                </Button>
            </Stack>
        </Stack>    

    </FormProvider>
  )
}
function CreateGroup({open,handleClose}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} TransitionComponent={Transition}>
        <DialogTitle sx={{mb:2}} >Create New Group  </DialogTitle>
        <DialogContent>
            {/* Form */}
            <CreateGroupForm handleClose={handleClose}/>
        </DialogContent>
    </Dialog>
  )
}

export default CreateGroup