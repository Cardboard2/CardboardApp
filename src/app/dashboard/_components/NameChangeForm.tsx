import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { DashboardProps } from './DashboardProps'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useForm, SubmitHandler } from "react-hook-form"
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'

type Inputs = {
  name: string
}

export function NameChangeForm( props : {dashboardProps: DashboardProps}) {

  const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>();

  const createFolderAPI = api.aws.createFolder.useMutation({
    onSuccess: () => {
      props.dashboardProps.shouldGetFolder.current = true;
      props.dashboardProps.updateFileListCounter(props.dashboardProps.fileListUpdatedCounter+1);
      props.dashboardProps.setNameChangeFormOpen(false);
      reset();
    },
  });

  const renameFileAPI = api.aws.renameFile.useMutation({
    onSuccess: () => {
      props.dashboardProps.shouldGetFolder.current = true;
      props.dashboardProps.updateFileListCounter(props.dashboardProps.fileListUpdatedCounter+1);
      props.dashboardProps.setNameChangeFormOpen(false);
      props.dashboardProps.updateFileListCounter(props.dashboardProps.fileListUpdatedCounter-1);
      reset();
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    if (props.dashboardProps.nameChangeFormTarget == "") {
      if (data.name)
        createFolderAPI.mutate({
          request: { name: data.name, parentId: props.dashboardProps.currFolderId },
        });
    } else {

      if (data.name)
        renameFileAPI.mutate({
          request: { oldName: props.dashboardProps.nameChangeFormTarget, newName: data.name, folderId: props.dashboardProps.currFolderId },
      });
    }

  };


  return (
    <>
      <Transition appear show={props.dashboardProps.nameChangeFormOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30 w-screen h-screen" onClose={()=>props.dashboardProps.setNameChangeFormOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-amber-300 p-6 text-left align-middle shadow-xl transition-all ${createFolderAPI.isLoading || renameFileAPI.isLoading ? "cursor-wait" : ""}`}>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 truncate"
                  >
                    {props.dashboardProps.nameChangeFormHeader}
                  </Dialog.Title>
                  <form>
                    <div className="py-2 px-4 bg-amber-200 mt-4 rounded-full shadow-inner">
                      <input {...register("name", { required: {value:true , message: "Please input a name"}, pattern: {value: /^[a-z0-9 ]+[a-z0-9]+$/i, message: "Invalid name"}, maxLength: {value:128, message: "Max length 128 characters"}})}
                      className='w-full bg-transparent placeholder-gray-700  focus:outline-none text-gray-900' placeholder='Enter the new name here'/>
                    </div>
                    {errors.name && <span className='text-sm text-gray-700 w-full flex justify-center'>{errors.name.message}</span>}
                    <div className="mt-4 flex">
                      <button onClick={handleSubmit(onSubmit)} disabled={createFolderAPI.isLoading || renameFileAPI.isLoading} className="disabled:cursor-not-allowed disabled:opacity-50">
                        <CheckCircleIcon
                          className={`w-12 h-12 text-green-500 hover:text-green-600 active:opacity-80 duration-300`}/>
                      </button>
                      
                      <XCircleIcon 
                        onClick={()=>{
                          props.dashboardProps.setNameChangeFormOpen(false)
                          reset()}}
                        className="w-12 h-12 text-red-500 hover:text-red-600 active:opacity-80 duration-300"/>
                    </div>
                  </form>

                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
