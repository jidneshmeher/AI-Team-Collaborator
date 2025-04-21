import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <section className="bg-[#07080b]">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/images/image1.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <SignIn />
          </main>
        </div>
      </section>
    </>
  );
}
