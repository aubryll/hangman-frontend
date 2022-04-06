import Link from "next/link";
type CustomLinkProps = React.ComponentProps<typeof Link> & {
    name: string;
};

const CustomLink = ({ name, ...other }: CustomLinkProps) => {
    return (
        <Link {...other} passHref>
            <a style={{ color: "#1C9BB7" }}>{name}</a>
        </Link>
    );
};

export default CustomLink;
