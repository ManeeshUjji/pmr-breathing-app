import { redirect } from 'next/navigation';

// Redirect old programs page to the new library page
export default function ProgramsPage() {
  redirect('/library');
}
