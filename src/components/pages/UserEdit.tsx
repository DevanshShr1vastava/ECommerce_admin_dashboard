import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, InputNumber, Select, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { updateUser } from "../utils/AuthAPI";
import { useEffect, useState } from "react";
import { IUpdateUserInfo, userStore } from "../utils/AppStores";

const { Option } = Select;

const editUserSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  age: yup.number().required("Age is required").positive().integer(),
  gender: yup.mixed<"male" | "female" | "other">()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  image: yup.string().url("Invalid image URL").required("Image is required"),
  role: yup.mixed<"admin" | "moderator" | "user">()
    .oneOf(["admin", "moderator", "user"], "Invalid role")
    .required("Role is required"),
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const UserStore = userStore();
  const userDetails = UserStore.users.find((user)=>user.id === Number(id))
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<IUpdateUserInfo>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      age: userDetails?.age,
      gender: userDetails?.gender,
      email: userDetails?.email,
      phone: userDetails?.phone,
      image: userDetails?.image,
      role : userDetails?.role,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: IUpdateUserInfo) => updateUser(Number(id), data),
    onSuccess: () => {
      navigate("/users");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data: IUpdateUserInfo) => {
    const dataToSend: IUpdateUserInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      image: data.image,
      role : data.role,
    };
    UserStore.updateUser(Number(id),dataToSend)
    mutate(dataToSend);
  };

  useEffect(() => {
    if (userDetails) {
      reset({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        age: userDetails.age || undefined,
        gender: userDetails.gender || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        image: userDetails.image || "",
        role: userDetails.role || "",
      });
    }
  }, [userDetails, reset]);

  useEffect(()=>{
    if (UserStore.users.length === 0) {
      UserStore.fetchUsers().then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  },[])


  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;
  }


  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item label="First Name" validateStatus={errors.firstName ? "error" : ""} help={errors.firstName?.message}>
        <Controller name="firstName" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Last Name" validateStatus={errors.lastName ? "error" : ""} help={errors.lastName?.message}>
        <Controller name="lastName" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Age" validateStatus={errors.age ? "error" : ""} help={errors.age?.message}>
        <Controller name="age" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
      </Form.Item>

      <Form.Item label="Role" validateStatus={errors.role ? "error" : ""} help={errors.role?.message}>
        <Controller name="role" control={control} render={({ field }) => (
            <Select {...field}>
                <Option value = "admin">admin</Option>
                <Option value = "user">user</Option>
                <Option value = "moderator">moderator</Option>
            </Select>
        )} />
      </Form.Item>

      <Form.Item label="Gender" validateStatus={errors.gender ? "error" : ""} help={errors.gender?.message}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <Option value="female">Female</Option>
              <Option value="male">Male</Option>
              <Option value="other">Other</Option>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
        <Controller name="email" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Phone" validateStatus={errors.phone ? "error" : ""} help={errors.phone?.message}>
        <Controller name="phone" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Profile Image URL" validateStatus={errors.image ? "error" : ""} help={errors.image?.message}>
        <Controller name="image" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditUser;
