import { redirect } from 'next/navigation';

// Redirect old program detail pages to the library
// Users can find individual exercises in the library now
export default function ProgramDetailPage() {
  redirect('/library');
}
