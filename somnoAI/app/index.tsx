import { Redirect } from 'expo-router';

export default function Index() {
  // By default, redirect to the auth flow
  return <Redirect href="/(auth)/signin" />;
}