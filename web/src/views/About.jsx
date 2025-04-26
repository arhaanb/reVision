import { User, Sparkles, HeartHandshake } from "lucide-react";
import Logo from "../assets/logo-vision.svg";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4">
      <div className="bg-[#ffffff60] backdrop-blur-md border border-orange-100 shadow-lg rounded-2xl p-10 max-w-2xl w-full flex flex-col items-center">
        <img src={Logo} alt="" className="w-[50%] mb-4 mt-4" />
        <h1 className="text-lg md:text-xl text-orange-600 mb-4 text-center">
          About us
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6 text-center max-w-xl">
          <span className="font-semibold text-orange-500">reVision</span> is for
          individuals who are not tech or design oriented but want to start
          building digital products. reVision leverages AI to help bring your
          vision forward, building a customized, personal mini-product just for
          you.
        </p>
        <div className="flex flex-col md:flex-row gap-6 mt-6 w-full justify-center">
          <div className="flex-1 bg-orange-50/80 rounded-xl p-6 shadow-sm border border-orange-100 flex flex-col items-center">
            <div className="flex flex-col items-center mb-2">
              <User className="w-8 h-8 text-orange-400 mb-1" />
              <span className="text-2xl font-bold text-orange-500">
                No Coding Required
              </span>
            </div>
            <p className="text-gray-600 text-center">
              Just share your idea, and let AI do the rest. No tech skills
              needed!
            </p>
          </div>
          <div className="flex-1 bg-orange-50/80 rounded-xl p-6 shadow-sm border border-orange-100 flex flex-col items-center">
            <div className="flex flex-col items-center mb-2">
              <Sparkles className="w-8 h-8 text-orange-400 mb-1" />
              <span className="text-2xl font-bold text-orange-500">
                Personalized Results
              </span>
            </div>
            <p className="text-gray-600 text-center">
              Get a mini-product tailored to your vision, style, and needs.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 font-semibold px-6 py-2 rounded-full shadow-sm">
            <HeartHandshake className="w-6 h-6 text-orange-400 mr-1" />
            Empowering creativity for everyone
          </span>
        </div>
      </div>
    </div>
  );
}
