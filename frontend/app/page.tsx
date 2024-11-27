import AdvancedCountdown from "../components/AdvancedCountdown";
// import TeacherRoster from "../components/TeacherRoster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <AdvancedCountdown />
        {/* <TeacherRoster /> */}
      </div>
    </main>
  );
}
