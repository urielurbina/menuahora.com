'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Links() {
  const [customLinks, setCustomLinks] = useState([])

  const addCustomLink = () => {
    setCustomLinks([...customLinks, { title: '', url: '' }])
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-base font-semibold leading-7 text-gray-900">Manage Your Links</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Customize your profile by adding your social media and contact information.
        </p>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
          {[
            { name: 'Phone', placeholder: 'Enter your phone number', icon: 'phone' },
            { name: 'Mobile', placeholder: 'Enter your mobile number', icon: 'mobile' },
            { name: 'Email', placeholder: 'Enter your email address', icon: 'envelope' },
            { name: 'Instagram', placeholder: 'Enter your Instagram username', icon: 'instagram' },
            { name: 'Facebook', placeholder: 'Enter your Facebook profile URL', icon: 'facebook' },
            { name: 'WhatsApp', placeholder: 'Enter your WhatsApp number', icon: 'whatsapp' },
            { name: 'TikTok', placeholder: 'Enter your TikTok username', icon: 'tiktok' },
          ].map((field) => (
            <div key={field.name} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor={field.name.toLowerCase()} className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                {field.name}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    <i className={`fas fa-${field.icon} w-5 h-5`}></i>
                  </span>
                  <input
                    type="text"
                    name={field.name.toLowerCase()}
                    id={field.name.toLowerCase()}
                    placeholder={field.placeholder}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-base font-semibold leading-7 text-gray-900">Custom Links</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Add your own custom links to your profile.
        </p>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
          {customLinks.map((link, index) => (
            <div key={index} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Custom Link {index + 1}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Link Title"
                    className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = [...customLinks]
                      newLinks[index].title = e.target.value
                      setCustomLinks(newLinks)
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Link URL"
                    className="block w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...customLinks]
                      newLinks[index].url = e.target.value
                      setCustomLinks(newLinks)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <motion.button
            type="button"
            onClick={addCustomLink}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Custom Link
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href="/dashboard"
          className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Back to Dashboard
        </Link>
        <motion.button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </div>
    </div>
  )
}
