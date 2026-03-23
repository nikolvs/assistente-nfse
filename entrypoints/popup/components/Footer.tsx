import Link from '~/components/Link';

const version = browser.runtime.getManifest().version;
const githubUrl = import.meta.env.WXT_GITHUB_URL;

export default function Footer() {
  return (
    <footer className="px-4 py-1 flex items-center justify-between">
      <span className="text-[10px] text-gray-300">
        Desenvolvido por <Link href="https://nkls.dev" variant="subtle">nkls.dev</Link>
      </span>
      <span className="text-[10px] text-gray-300 flex items-center gap-1">
        {githubUrl && (
          <>
            <Link href={githubUrl} variant="subtle">GitHub</Link>
            <span>·</span>
          </>
        )}
        v{version}
      </span>
    </footer>
  );
}
