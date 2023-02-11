import React from "react";
import {
	About,
	Landing, List, Login, SignUp
} from "../Pages";

export const routes = [
	{
		title: "Landing",
		path: "/",
		element: <Landing />,
	},
	{
		title: "Login",
		path: "/login",
		element: <Login />,
	},
	{
		title: "Sign Up",
		path: "/signup",
		element: <SignUp />
	},
	{
		title: "About",
		path: "/about",
		element: <About />
	},
	// {
	// 	title: "List",
	// 	path: "/list",
	// 	element: <List />,
	// },
];

export const privateRoutes = [
	{
		title: "List",
		path: "/list",
		element: <List />,
	},
];